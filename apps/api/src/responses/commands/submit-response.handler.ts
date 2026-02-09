import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { SubmitResponseCommand } from './submit-response.command';
import { PrismaService } from '../../prisma/prisma.service';
import { ResponseSubmittedEvent } from '../events/response-submitted.event';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@CommandHandler(SubmitResponseCommand)
export class SubmitResponseHandler implements ICommandHandler<SubmitResponseCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SubmitResponseCommand) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: command.surveyId },
      include: { questions: true },
    });

    if (!survey) {
      throw new NotFoundException(`Survey with ID ${command.surveyId} not found`);
    }

    if (!survey.isPublished) {
      throw new BadRequestException('Cannot submit response to an unpublished survey');
    }

    // Prosta walidacja: sprawdź czy wszystkie przesłane questionId należą do tej ankiety
    const surveyQuestionIds = new Set(survey.questions.map(q => q.id));
    for (const answer of command.answers) {
      if (!surveyQuestionIds.has(answer.questionId)) {
        throw new BadRequestException(`Question ${answer.questionId} does not belong to survey ${command.surveyId}`);
      }
    }

    const response = await this.prisma.response.create({
      data: {
        surveyId: command.surveyId,
        userId: command.userId,
        answers: {
          create: command.answers.map(a => ({
            questionId: a.questionId,
            value: a.value,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    this.eventBus.publish(
      new ResponseSubmittedEvent(
        response.id,
        response.surveyId,
        response.createdAt,
        response.answers.map(a => ({
          id: a.id,
          questionId: a.questionId,
          value: a.value,
        })),
      ),
    );

    return response;
  }
}

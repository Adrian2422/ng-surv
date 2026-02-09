import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateSurveyCommand } from './create-survey.command';
import { PrismaService } from '../../prisma/prisma.service';
import { SurveyCreatedEvent } from '../events/survey-created.event';

@CommandHandler(CreateSurveyCommand)
export class CreateSurveyHandler implements ICommandHandler<CreateSurveyCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateSurveyCommand) {
    const survey = await this.prisma.survey.create({
      data: {
        ownerId: command.ownerId,
        title: command.title,
        description: command.description,
        isAnonymous: command.isAnonymous,
      },
    });

    this.eventBus.publish(
      new SurveyCreatedEvent(
        survey.id,
        survey.ownerId,
        survey.title,
        survey.description,
        survey.isPublished,
        survey.createdAt,
      ),
    );

    return survey;
  }
}

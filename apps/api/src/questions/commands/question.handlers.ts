import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { AddQuestionCommand, RemoveQuestionCommand } from './question.commands';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionAddedEvent, QuestionRemovedEvent } from '../events/question.events';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(AddQuestionCommand)
export class AddQuestionHandler implements ICommandHandler<AddQuestionCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddQuestionCommand) {
    const question = await this.prisma.question.create({
      data: {
        surveyId: command.surveyId,
        text: command.text,
        type: command.type,
        required: command.required,
        order: command.order,
        options: {
          create: command.options || [],
        },
      },
    });

    this.eventBus.publish(
      new QuestionAddedEvent(
        question.id,
        question.surveyId,
        question.text,
        question.type,
        question.order,
      ),
    );

    return question;
  }
}

@CommandHandler(RemoveQuestionCommand)
export class RemoveQuestionHandler implements ICommandHandler<RemoveQuestionCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveQuestionCommand) {
    const question = await this.prisma.question.findUnique({
      where: { id: command.questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${command.questionId} not found`);
    }

    await this.prisma.question.delete({
      where: { id: command.questionId },
    });

    this.eventBus.publish(
      new QuestionRemovedEvent(question.id, question.surveyId),
    );
  }
}

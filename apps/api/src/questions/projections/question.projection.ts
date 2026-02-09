import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QuestionAddedEvent, QuestionRemovedEvent } from '../events/question.events';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@EventsHandler(QuestionAddedEvent, QuestionRemovedEvent)
export class QuestionProjection implements IEventHandler<QuestionAddedEvent | QuestionRemovedEvent> {
  private readonly logger = new Logger(QuestionProjection.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: QuestionAddedEvent | QuestionRemovedEvent) {
    if (event instanceof QuestionAddedEvent) {
      await this.handleAdded(event);
    } else if (event instanceof QuestionRemovedEvent) {
      await this.handleRemoved(event);
    }
  }

  private async handleAdded(event: QuestionAddedEvent) {
    this.logger.log(`Projecting question added: ${event.id}`);
    
    await this.prisma.$transaction([
      this.prisma.questionRead.create({
        data: {
          id: event.id,
          surveyId: event.surveyId,
          text: event.text,
          type: event.type,
          order: event.order,
        },
      }),
      this.prisma.surveyRead.update({
        where: { id: event.surveyId },
        data: {
          questionCount: { increment: 1 },
        },
      }),
    ]);
  }

  private async handleRemoved(event: QuestionRemovedEvent) {
    this.logger.log(`Projecting question removed: ${event.id}`);

    await this.prisma.$transaction([
      this.prisma.questionRead.delete({
        where: { id: event.id },
      }),
      this.prisma.surveyRead.update({
        where: { id: event.surveyId },
        data: {
          questionCount: { decrement: 1 },
        },
      }),
    ]);
  }
}

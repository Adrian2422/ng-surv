import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SurveyCreatedEvent } from '../events/survey-created.event';
import { SurveyPublishedEvent } from '../events/survey-published.event';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@EventsHandler(SurveyCreatedEvent, SurveyPublishedEvent)
export class SurveyProjection implements IEventHandler<SurveyCreatedEvent | SurveyPublishedEvent> {
  private readonly logger = new Logger(SurveyProjection.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: SurveyCreatedEvent | SurveyPublishedEvent) {
    if (event instanceof SurveyCreatedEvent) {
      await this.handleCreated(event);
    } else if (event instanceof SurveyPublishedEvent) {
      await this.handlePublished(event);
    }
  }

  private async handleCreated(event: SurveyCreatedEvent) {
    this.logger.log(`Projecting survey created: ${event.surveyId}`);
    
    await this.prisma.surveyRead.create({
      data: {
        id: event.surveyId,
        title: event.title,
        isPublished: event.isPublished,
        questionCount: 0,
        responseCount: 0,
        createdAt: event.createdAt,
      },
    });
  }

  private async handlePublished(event: SurveyPublishedEvent) {
    this.logger.log(`Projecting survey published: ${event.surveyId}`);

    await this.prisma.surveyRead.update({
      where: { id: event.surveyId },
      data: { isPublished: true },
    });
  }
}

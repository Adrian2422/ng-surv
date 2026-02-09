import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { PublishSurveyCommand } from './publish-survey.command';
import { PrismaService } from '../../prisma/prisma.service';
import { SurveyPublishedEvent } from '../events/survey-published.event';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(PublishSurveyCommand)
export class PublishSurveyHandler implements ICommandHandler<PublishSurveyCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: PublishSurveyCommand) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: command.surveyId },
    });

    if (!survey) {
      throw new NotFoundException(`Survey with ID ${command.surveyId} not found`);
    }

    await this.prisma.survey.update({
      where: { id: command.surveyId },
      data: { isPublished: true },
    });

    this.eventBus.publish(new SurveyPublishedEvent(command.surveyId));
  }
}

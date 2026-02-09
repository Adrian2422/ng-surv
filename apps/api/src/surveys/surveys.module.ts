import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SurveysController } from './surveys.controller';
import { CreateSurveyHandler } from './commands/create-survey.handler';
import { PublishSurveyHandler } from './commands/publish-survey.handler';
import { ListSurveysHandler, GetSurveyHandler } from './queries/survey.handlers';
import { SurveyProjection } from './projections/survey.projection';

const CommandHandlers = [CreateSurveyHandler, PublishSurveyHandler];
const QueryHandlers = [ListSurveysHandler, GetSurveyHandler];
const EventHandlers = [SurveyProjection];

@Module({
  imports: [CqrsModule],
  controllers: [SurveysController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class SurveysModule {}

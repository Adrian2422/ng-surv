import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QuestionsController } from './questions.controller';
import { AddQuestionHandler, RemoveQuestionHandler } from './commands/question.handlers';
import { QuestionProjection } from './projections/question.projection';

const CommandHandlers = [AddQuestionHandler, RemoveQuestionHandler];
const EventHandlers = [QuestionProjection];

@Module({
  imports: [CqrsModule],
  controllers: [QuestionsController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class QuestionsModule {}

import { QuestionType } from '../../../generated/prisma/enums';

export class QuestionAddedEvent {
  constructor(
    public readonly id: string,
    public readonly surveyId: string,
    public readonly text: string,
    public readonly type: QuestionType,
    public readonly order: number,
  ) {}
}

export class QuestionRemovedEvent {
  constructor(
    public readonly id: string,
    public readonly surveyId: string,
  ) {}
}

import { QuestionType } from '../../../generated/prisma/enums';

export class AddQuestionCommand {
  constructor(
    public readonly surveyId: string,
    public readonly text: string,
    public readonly type: QuestionType,
    public readonly required: boolean,
    public readonly order: number,
    public readonly options?: Array<{ label: string; value: string; order: number }>,
  ) {}
}

export class RemoveQuestionCommand {
  constructor(public readonly questionId: string) {}
}

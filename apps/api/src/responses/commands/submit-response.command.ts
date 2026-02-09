export class SubmitResponseCommand {
  constructor(
    public readonly surveyId: string,
    public readonly answers: Array<{ questionId: string; value: any }>,
    public readonly userId?: string,
  ) {}
}

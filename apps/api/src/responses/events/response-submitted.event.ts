export class ResponseSubmittedEvent {
  constructor(
    public readonly responseId: string,
    public readonly surveyId: string,
    public readonly createdAt: Date,
    public readonly answers: Array<{ id: string; questionId: string; value: any }>,
  ) {}
}

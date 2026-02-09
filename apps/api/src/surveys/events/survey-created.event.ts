export class SurveyCreatedEvent {
  constructor(
    public readonly surveyId: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly isPublished: boolean,
    public readonly createdAt: Date,
  ) {}
}

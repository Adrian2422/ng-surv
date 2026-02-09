export class CreateSurveyCommand {
  constructor(
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description?: string,
    public readonly isAnonymous: boolean = false,
  ) {}
}

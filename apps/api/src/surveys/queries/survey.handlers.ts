import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListSurveysQuery, GetSurveyQuery } from './survey.queries';
import { PrismaService } from '../../prisma/prisma.service';

@QueryHandler(ListSurveysQuery)
export class ListSurveysHandler implements IQueryHandler<ListSurveysQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    return this.prisma.surveyRead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

@QueryHandler(GetSurveyQuery)
export class GetSurveyHandler implements IQueryHandler<GetSurveyQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetSurveyQuery) {
    return this.prisma.surveyRead.findUnique({
      where: { id: query.id },
    });
  }
}

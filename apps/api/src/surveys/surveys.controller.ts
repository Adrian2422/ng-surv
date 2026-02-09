import { Controller, Post, Body, Get, Param, NotFoundException, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { CreateSurveyCommand } from './commands/create-survey.command';
import { PublishSurveyCommand } from './commands/publish-survey.command';
import { ListSurveysQuery, GetSurveyQuery } from './queries/survey.queries';

@Controller('surveys')
export class SurveysController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateSurveyDto) {
    // Tymczasowo używamy hardcoded ownerId, póki nie ma modułu Auth
    const ownerId = 'default-user-id'; 
    return this.commandBus.execute(
      new CreateSurveyCommand(ownerId, dto.title, dto.description, dto.isAnonymous),
    );
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return this.commandBus.execute(new PublishSurveyCommand(id));
  }

  @Get()
  async findAll() {
    return this.queryBus.execute(new ListSurveysQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const survey = await this.queryBus.execute(new GetSurveyQuery(id));
    if (!survey) {
      throw new NotFoundException(`Survey with ID ${id} not found`);
    }
    return survey;
  }
}

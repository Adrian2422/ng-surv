import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddQuestionDto } from './dto/add-question.dto';
import { AddQuestionCommand, RemoveQuestionCommand } from './commands/question.commands';
import { PrismaService } from '../prisma/prisma.service';

@Controller('surveys/:surveyId/questions')
export class QuestionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async add(@Param('surveyId') surveyId: string, @Body() dto: AddQuestionDto) {
    return this.commandBus.execute(
      new AddQuestionCommand(
        surveyId,
        dto.text,
        dto.type,
        dto.required,
        dto.order,
        dto.options,
      ),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commandBus.execute(new RemoveQuestionCommand(id));
  }

  @Get()
  async findAll(@Param('surveyId') surveyId: string) {
    // Prosty odczyt z read modelu (można by przenieść do QueryHandlera, ale dla prostoty tutaj)
    return this.prisma.questionRead.findMany({
      where: { surveyId },
      orderBy: { order: 'asc' },
    });
  }
}

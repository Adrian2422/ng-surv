import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { SubmitResponseCommand } from './commands/submit-response.command';
import { PrismaService } from '../prisma/prisma.service';

@Controller('surveys/:surveyId/responses')
export class ResponsesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async submit(
    @Param('surveyId') surveyId: string,
    @Body() dto: SubmitResponseDto,
  ) {
    // userId opcjonalne
    return this.commandBus.execute(
      new SubmitResponseCommand(surveyId, dto.answers),
    );
  }

  @Get()
  async findAll(@Param('surveyId') surveyId: string) {
    return this.prisma.responseRead.findMany({
      where: { surveyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('results')
  async getResults(@Param('surveyId') surveyId: string) {
    return this.prisma.aggregateResult.findMany({
      where: { surveyId },
    });
  }
}

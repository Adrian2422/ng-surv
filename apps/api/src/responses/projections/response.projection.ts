import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ResponseSubmittedEvent } from '../events/response-submitted.event';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@EventsHandler(ResponseSubmittedEvent)
export class ResponseProjection implements IEventHandler<ResponseSubmittedEvent> {
  private readonly logger = new Logger(ResponseProjection.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ResponseSubmittedEvent) {
    this.logger.log(`Projecting response submitted: ${event.responseId}`);

    await this.prisma.$transaction(async (tx) => {
      // 1. Create ResponseRead
      await tx.responseRead.create({
        data: {
          id: event.responseId,
          surveyId: event.surveyId,
          createdAt: event.createdAt,
        },
      });

      // 2. Create AnswerRead entries
      for (const answer of event.answers) {
        await tx.answerRead.create({
          data: {
            id: answer.id,
            responseId: event.responseId,
            questionId: answer.questionId,
            value: answer.value,
          },
        });

        // 3. Update AggregateResult
        // W prawdziwym systemie tutaj byłaby bardziej skomplikowana logika agregacji
        // Tutaj po prostu inkrementujemy licznik odpowiedzi w metrics
        const aggregate = await tx.aggregateResult.findFirst({
          where: { surveyId: event.surveyId, questionId: answer.questionId },
        });

        if (aggregate) {
          const metrics = aggregate.metrics as any;
          metrics.count = (metrics.count || 0) + 1;
          // Można dodać zliczanie konkretnych wartości dla SINGLE_CHOICE itp.
          if (typeof answer.value === 'string' || typeof answer.value === 'number') {
            metrics.distribution = metrics.distribution || {};
            metrics.distribution[answer.value] = (metrics.distribution[answer.value] || 0) + 1;
          }

          await tx.aggregateResult.update({
            where: { id: aggregate.id },
            data: { metrics },
          });
        } else {
          const metrics: any = { count: 1 };
          if (typeof answer.value === 'string' || typeof answer.value === 'number') {
            metrics.distribution = { [answer.value]: 1 };
          }

          await tx.aggregateResult.create({
            data: {
              surveyId: event.surveyId,
              questionId: answer.questionId,
              metrics,
            },
          });
        }
      }

      // 4. Update survey response count
      await tx.surveyRead.update({
        where: { id: event.surveyId },
        data: {
          responseCount: { increment: 1 },
        },
      });
    });
  }
}

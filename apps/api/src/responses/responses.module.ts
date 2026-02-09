import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ResponsesController } from './responses.controller';
import { SubmitResponseHandler } from './commands/submit-response.handler';
import { ResponseProjection } from './projections/response.projection';

const CommandHandlers = [SubmitResponseHandler];
const EventHandlers = [ResponseProjection];

@Module({
  imports: [CqrsModule],
  controllers: [ResponsesController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class ResponsesModule {}

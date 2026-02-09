import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SubmitResponseSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    value: z.any(),
  })),
});

export class SubmitResponseDto extends createZodDto(SubmitResponseSchema) {}

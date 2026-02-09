import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateSurveySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export class CreateSurveyDto extends createZodDto(CreateSurveySchema) {}

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { QuestionType } from '../../../generated/prisma/enums';

export const AddQuestionSchema = z.object({
  text: z.string().min(1),
  type: z.nativeEnum(QuestionType),
  required: z.boolean().default(false),
  order: z.number().int(),
  options: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    order: z.number().int(),
  })).optional(),
});

export class AddQuestionDto extends createZodDto(AddQuestionSchema) {}

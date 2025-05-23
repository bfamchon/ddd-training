import { BadRequestException, Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe {
  constructor(private readonly schema: z.Schema<unknown>) {}
  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (result.success) {
      return result.data;
    }
    throw new BadRequestException('Failed to validate');
  }
}

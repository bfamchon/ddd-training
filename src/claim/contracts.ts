import { z } from 'zod';

export const CreateClaimSchema = z.object({
  customerId: z.string(),
  billingId: z.string(),
  message: z.string(),
  amount: z.number().positive(),
});

export type CreateClaimRequest = z.infer<typeof CreateClaimSchema>;

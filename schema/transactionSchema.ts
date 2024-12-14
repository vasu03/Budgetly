// Importing required modules
import { z } from "zod";

// Creating and exporting a Zod schema to validate the Creation of new Transaction
export const CreateTransactionSchema = z.object({
    amount: z.coerce.number().positive().multipleOf(0.01),
    description: z.string().optional(),
    date: z.coerce.date(),
    category: z.string(),
    type: z.union([z.literal("income"), z.literal("expense")])
}); 

// Create and export a data type for our schema
export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;
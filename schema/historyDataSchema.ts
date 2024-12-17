// Importing required modules
import { z } from "zod";

// Creating and exporting a Zod schema to validate the fetch Overview data
export const HistoryDataQuerySchema = z.object({
    timeframe: z.enum(["month", "year"]),
    month: z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().min(2000).max(3000),
});

export type HistoryDataQuerySchemaType = z.infer<typeof HistoryDataQuerySchema>;
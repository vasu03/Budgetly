// Importing required modules
import { z } from "zod";
import { differenceInDays } from "date-fns";

// Importing custom constants
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";

// Creating and exporting a Zod schema to validate the fetch Overview data
export const OverviewQuerySchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
}).refine((args) => {
    // Defining custom validations by refining the existing ones
    const { from, to } = args;
    const days = differenceInDays(to, from);
    const isValidRange = (days >= 0 && days <= MAX_DATE_RANGE_DAYS);

    return isValidRange;
});

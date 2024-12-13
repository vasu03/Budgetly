// Importing required modules
import { z } from "zod";

// Importing custom data types
import { Currencies } from "@/lib/currencies";

// Creating and exporting a Zod schema to validate the update user currency form
export const UpdateUserCurrencySchema = z.object({
    // validate the currency with custom checks
    currency: z.custom((value) => {
        const found = Currencies.some((c) => c.value === value);
        if (!found) throw new Error(`Invalid currency type: ${value}`);

        return value;
    }),
})
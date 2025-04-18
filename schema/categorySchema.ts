// Importing required modules
import {z} from "zod";

// Creating and exporting a Zod schema to validate the Creation of new Transaction category
export const CreateCategorySchema = z.object({
    name: z.string().min(3).max(20),
    icon: z.string().max(20),
    type: z.enum(["income", "expense"])
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;


// Creating and exporting a Zod schema to validate the Deletion of a Transaction category
export const DeleteCategorySchema = z.object({
    name: z.string().min(3).max(20),
    type: z.enum(["income", "expense"])
});

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
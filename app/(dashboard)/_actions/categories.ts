// Make this Server sided to use Server Actions
"use server";

// Importing required modules
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Importing custom validation schemas
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categorySchema";

// Create and export a function to Create a new Txn Category in db
export const CreateCategory = async (form: CreateCategorySchemaType) => {
    // validate the data to be updated
    const parsedbody = CreateCategorySchema.safeParse(form);

    // throw an error if validation fails
    if (!parsedbody.success) throw new Error(parsedbody.error.message);

    // grab the current user details using clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // extract the incoming data and push it into DB
    const {name, icon, type} = parsedbody.data;
    const category = await prisma.category.create({
        data: { 
            userId: currUser.id,
            name: name,
            icon: icon,
            type: type
         },
    });

    // return the created data as response
    return category;
};
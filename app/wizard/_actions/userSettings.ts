// Make this Server sided to use Server Actions
"use server";

// Importing required modules
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Importing custom validation schemas
import { UpdateUserCurrencySchema } from "@/schema/userSchema";


// Create and export a function to update the user currency in db
export const UpdateUserCurrency = async (currency: string) => {
    // validate the data to be updated
    const parsedbody = UpdateUserCurrencySchema.safeParse({ currency });

    // throw an error if validation fails
    if (!parsedbody.success) throw parsedbody.error;

    // define an API call to update the data into DB
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // update the user data in db
    const userSettings = await prisma.userSettings.update({
        where: { userId: currUser.id },
        data: { currency },
    });

    // return the updated data as response
    return userSettings;
};
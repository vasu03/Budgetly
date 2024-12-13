// Importing required modules
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Creating and Exporting a GET/Fetch data route
export const GET = async (request: Request) => {
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // Get the user details from the DB
    let userSettings = await prisma.userSettings.findUnique({
        where: { userId: currUser.id },
    });

    // If the user is new then create default user settings (to handle Wizard page)
    if (!userSettings) {
        userSettings = await prisma.userSettings.create({
            data: {
                userId: currUser.id,
                currency: "INR",
            },
        });
    }

    // revalidate the /dashboard path that uses the user-currency
    revalidatePath("/");

    // return a response as a JSON object
    return Response.json(userSettings);
};


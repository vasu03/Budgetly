// Importing required modules
import { z } from "zod";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";


// Creating and Exporting a GET/Fetch data route
export const GET = async (request: Request) => {
    // Grab the current user via clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // get the url parameters
    const { searchParams } = new URL(request.url);
    const paramType = searchParams.get("type");

    // validate the params and use in query
    const validator = z.enum(["expense", "income"]).nullable();
    const queryParams = validator.safeParse(paramType);
    if (!queryParams.success) {
        return Response.json(queryParams.error, { status: 400 });
    }

    const type = queryParams.data;

    // fetch the data from db
    const categories = await prisma.category.findMany({
        where: {
            userId: currUser.id,
            ...(type && { type }),
        },
        orderBy: { name: "asc" },
    });

    // return the data in Response as a json object
    return Response.json(categories);
};
// Importing required modules
import { z } from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Importing custom validation schemas
import { OverviewQuerySchema } from "@/schema/overviewSchema";

// Creating and Exporting a GET/Fetch data route
export const GET = async (request: Request) => {
    // Grab the current user via clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // get the url parameters (date range)
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // validate the params and use in query
    const queryParams = OverviewQuerySchema.safeParse({ from, to });
    if (!queryParams.success) {
        return Response.json(queryParams.error, { status: 400 });
    }

    // fetch the data from db
    const stats = await getCategoryWiseStats(
        currUser.id,
        queryParams.data.from,
        queryParams.data.to,
    );

    // return the data in Response as a json object
    return Response.json(stats);
};

export type getCategoryWiseStatsResponseType = Awaited<ReturnType<typeof getCategoryWiseStats>>;

// Helper function to fetch the Category wise inc/exp statistics
const getCategoryWiseStats = async (userId: string, from: Date, to: Date) => {
    // Calculate and fetch the Current inc/exp category wise
    const currCatWiseStats = await prisma.transaction.groupBy({
        by: ["category", "categoryIcon", "type"],
        where: {
            userId: userId,
            date: {
                gte: from,
                lte: to,
            },
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: "desc"
            },
        },
    });

    return currCatWiseStats;
};
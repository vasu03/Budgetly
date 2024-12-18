// Importing required modules
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
    const stats = await getBalanceStats(
        currUser.id,
        queryParams.data.from,
        queryParams.data.to,
    );

    // return the data in Response as a json object
    return Response.json(stats);
};

export type getBalanceSatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>;

// Helper function to fetch the Balance statistics
const getBalanceStats = async (userId: string, from: Date, to: Date) => {
    // Calculate and fetch the current total data for the given Range of date 
    const currentTotals = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            userId: userId,
            date: {
                gte: from,
                lte: to
            },
        },
        _sum: {
            amount: true,
        },
    });

    // Calculate and fetch the overall total data for a user
    const overallTotals = await prisma.transaction.groupBy({
        by: ["type"],
        where: { userId: userId, },
        _sum: { amount: true, },
    });

    return {
        // return total income in given date range
        currIncome: currentTotals.find((ct) => ct.type === "income")?._sum.amount || 0,
        // return total expense in given date range
        currExpense: currentTotals.find((ct) => ct.type === "expense")?._sum.amount || 0,
        // return overall total income for a user
        totalIncome: overallTotals.find((ot) => ot.type === "income")?._sum.amount || 0,
        // return overall total expense for a user
        totalExpense: overallTotals.find((ot) => ot.type === "expense")?._sum.amount || 0,
    };
};
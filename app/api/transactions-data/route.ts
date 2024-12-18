// Importing required modules
import { z } from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Importing custom validation schemas
import { OverviewQuerySchema } from "@/schema/overviewSchema";
import { GetFormatterForCurrency } from "@/lib/helpers";

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
    const transactions = await getTransactionsData(
        currUser.id,
        queryParams.data.from,
        queryParams.data.to,
    );

    // return the data in Response as a json object
    return Response.json(transactions);
};

export type getTransactionsDataResponseType = Awaited<ReturnType<typeof getTransactionsData>>;

// Helper function to fetch the Transactions Data
const getTransactionsData = async (userId: string, from: Date, to: Date) => {
    // Get the currency details for the user
    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId
        }
    });
    if(!userSettings) throw new Error("User data not found");

    // then format the obtained currency of a user
    const formatter = GetFormatterForCurrency(userSettings.currency);

    // Calculate and fetch the transactions data for the given Range of date 
    const currTransactions = await prisma.transaction.findMany({
        where: {
            userId: userId,
            date: {
                gte: from,
                lte: to
            },
        },
        orderBy: [{date: "desc"}]
    });

    return currTransactions.map((txn) => ({
        ...txn,
        formattedAmount: formatter.format(txn.amount),
    }));
};
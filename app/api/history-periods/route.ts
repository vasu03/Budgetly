// Importing required modules
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Creating and Exporting a GET/Fetch data route
export const GET = async (request: Request) => {
    // Grab the current user via clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // Get the history period from db
    const historyPeriod = await getHistoryPeriod(currUser.id);

    return Response.json(historyPeriod);
};

export type GetHistoryPeriodResponseType = Awaited<ReturnType<typeof getHistoryPeriod>>;

// Helper function to fetch the Periods in years for the History section of app
const getHistoryPeriod = async (userId: string) => {
    // Calculate and fetch years available for the user
    const result = await prisma.monthHistory.findMany({
        where: { userId: userId },
        select: { year: true },
        distinct: ["year"],
        orderBy: [{ year: "asc" }],
    });

    const years = result.map((item) => item.year);
    if (years.length === 0) {
        return [new Date().getFullYear()];
    }

    return years;
};
// Importing required modules
import prisma from "@/lib/prisma";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Importing custom validation schemas
import { HistoryDataQuerySchema } from "@/schema/historyDataSchema";

// Importint custom data types
import { PeriodType, TimeframeType } from "@/lib/types";

// Creating and Exporting a GET/Fetch data route
export const GET = async (request: Request) => {
    // Grab the current user via clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // get the url parameters (date range)
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    // validate the params and use in query
    const queryParams = HistoryDataQuerySchema.safeParse({ timeframe, month, year });
    if (!queryParams.success) {
        return Response.json(queryParams.error, { status: 400 });
    }

    // fetch the data from db
    const historyData = await getHistoryData(
        currUser.id,
        queryParams.data.timeframe,
        {
            month: queryParams.data.month,
            year: queryParams.data.year,
        }
    );

    // return the data in Response as a json object
    return Response.json(historyData);
};

export type GetHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>;
type HistoryData = {
    expense: number,
    income: number,
    year: number,
    month: number,
    day?: number
};


// Helper function to fetch the Category wise inc/exp statistics
const getHistoryData = async (userId: string, timeframe: TimeframeType, period: PeriodType) => {
    // Calculate and fetch the History data as per given timeframe and period for a user
    switch (timeframe) {
        case "year": { return await getYearlyHistoryData(userId, period.year); };
        case "month": { return getMonthlyHistoryData(userId, period.year, period.month); };
    };
};

// A function to fetch the Yearly history data for a user
const getYearlyHistoryData = async (userId: string, year: number) => {
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: { userId: userId, year: year },
        _sum: { income: true, expense: true },
        orderBy: [{ month: "asc" }],
    });

    if (!result || result.length === 0) return [];

    // transform the obtained response in such a way it includes all month from [0 to 11] 
    // regardless of the income and expense data within it, so it can be easily maintained in History chart
    const yearlyHistoryData: HistoryData[] = [];

    // loop over all possible months
    for (let i = 0; i < 12; i++) {
        let expense = 0;
        let income = 0;

        const month = result.find((row) => row.month === i);

        // if month exists then set the income and expense fields
        if (month) {
            income = month._sum.income || 0;
            expense = month._sum.expense || 0;
        }

        // then push the current result into final results array
        yearlyHistoryData.push({
            income,
            expense,
            year,
            month: i,
        });

    }
    return yearlyHistoryData;
};

// A function to fetch the monthly history data as per year for a user
const getMonthlyHistoryData = async (userId: string, year: number, month: number) => {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: { userId: userId, year: year, month: month },
        _sum: { income: true, expense: true },
        orderBy: [{ day: "asc" }],
    });

    if (!result || result.length === 0) return [];

    // transform the obtained response in such a way it includes all days of a month
    // regardless of the income and expense data within it, so it can be easily maintained in History chart
    const monthlyHistoryData: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month));

    // loop over all possible days
    for (let i = 1; i <= daysInMonth; i++) {
        let expense = 0;
        let income = 0;

        const day = result.find((row) => row.day === i);

        // if day exists then set the income and expense fields
        if (day) {
            income = day._sum.income || 0;
            expense = day._sum.expense || 0;
        }

        // then push the current result into final results array
        monthlyHistoryData.push({
            income,
            expense,
            year,
            month,
            day: i
        });

    }
    return monthlyHistoryData;
};
// To make this a client side component
"use client";

// Impotring required modules
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// Importing custom data type
import { UserSettings } from "@prisma/client";
import { TransactionType } from "@/lib/types";
import { getCategoryWiseStatsResponseType } from "@/app/api/stats/categories/route";

// Importing custom helper functions
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";

// Importing pre-defined custom UI components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Importing custom components
import SkeletonWrapper from "@/components/SkeletonWrapper";

// Defining an Interface to define data type of our component props
interface Props {
    userSettings: UserSettings
    from: Date,
    to: Date
}

// Creating a component to show Category wise Income and Expenses
const CategoryWiseStats = ({ userSettings, from, to }: Props) => {
    // Making an API call to fetch/GET the Data for statistics cards
    const catWiseStatsQuery = useQuery<getCategoryWiseStatsResponseType>({
        queryKey: ["overview", "stats", "categories", from, to],
        queryFn: () => fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
    });

    // An output formatter that formats the output of above query
    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    // TSX to render the component
    return (
        <div className="relative w-full h-max grid grid-rows-1 grid-cols-1 sm:grid-cols-2 gap-2 py-2 px-3 md:px-6">
            <SkeletonWrapper isLoading={catWiseStatsQuery.isFetching} fullWidth >
                <CategoryCard
                    formatter={formatter}
                    type="income"
                    data={catWiseStatsQuery.data || []}
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={catWiseStatsQuery.isFetching} fullWidth >
                <CategoryCard
                    formatter={formatter}
                    type="expense"
                    data={catWiseStatsQuery.data || []}
                />
            </SkeletonWrapper>
        </div>
    );
};


// A component that render individual statistic card in the above Card container
const CategoryCard = ({ formatter, type, data }: {
    formatter: Intl.NumberFormat,
    type: TransactionType,
    data: getCategoryWiseStatsResponseType
}) => {
    // Filtering the data for a specific type
    const filteredData = data.filter((elem) => elem.type === type);
    const total = filteredData.reduce(
        (accuml, elem) => accuml + (elem._sum?.amount || 0),
        0
    );

    return (
        <Card className="h-70 w-full bg-muted-foreground/5 flex flex-col">
            <CardHeader className="rounded-[inherit] w-full p-3 space-y-0">
                <CardTitle className="!font-normal text-xl sm:!text-base md:!text-xl shrink-0">
                    {type === "income" ? "Current Income by category" : "Current Expense by category"}
                </CardTitle>
            </CardHeader>

            <div className="flex items-center justify-center">
                {/* Show the Alternate text if not data available */}
                {filteredData.length === 0 && (
                    <div className="h-60 w-full px-4 text-center flex flex-col items-center justify-center">
                        No data available for selected time period
                        <p className="text-muted-foreground text-sm">
                            Try selecting a different period or try adding new {" "}
                            {type === "income" ? "incomes" : "expenses"}
                        </p>
                    </div>
                )}

                {/* If data is available then render it */}
                {filteredData.length > 0 && (
                    <ScrollArea className="flex w-full h-60 px-4">
                        <div className="w-full flex flex-col gap-3">
                            {filteredData.map((item) => {
                                const amount = item._sum.amount || 0;
                                const percentage = (amount * 100) / (total || amount);
                                return (
                                    <div key={item.category} className="flex flex-col gap-1 w-full items-center justify-between">
                                        {/* Show each category name along with %tage and amount */}
                                        <div className="flex w-full items-center justify-between">
                                            <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200 text-sm sm:text-[13px] md:text-base">
                                                {item.categoryIcon} {item.category}
                                                <span className="text-xs text-muted-foreground">
                                                    ({percentage.toFixed(0)}%)
                                                </span>
                                            </span>
                                            <span className="flex items-center justify-center text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                                                {formatter.format(amount).split(".", 1)}
                                            </span>
                                        </div>
                                        {/* Show the Progress Bar for each category */}
                                        <Progress className="h-1" value={percentage} progresscolor={type === "income" ? "bg-emerald-400/50" : "bg-rose-400/50"} />
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </Card>
    );
}

// Exporting the component
export default CategoryWiseStats;
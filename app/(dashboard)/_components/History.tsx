// To make this as a Client side component
"use client";

// Importing required modules
import React, { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Importing custom data types
import { UserSettings } from "@prisma/client";
import { PeriodType, TimeframeType } from "@/lib/types";
import { GetHistoryDataResponseType } from "@/app/api/history-data/route";

// Importing custom helper functions
import { GetFormatterForCurrency } from "@/lib/helpers";

// Importing pre-defined UI components
import CountUp from "react-countup";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Imprting our custom components
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import SkeletonWrapper from "@/components/SkeletonWrapper";

// Creating our History Chart section
const History = ({ userSettings }: { userSettings: UserSettings }) => {
    // Some states to handle the data for our Chart
    const [timeframe, setTimeframe] = useState<TimeframeType>("month");
    const [period, setPeriod] = useState<PeriodType>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    // A formatter to format the output related to Currencies
    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    // Make an API call to fetch the history periods
    const historyDataQuery = useQuery<GetHistoryDataResponseType>({
        queryKey: ["overview", "history", timeframe, period],
        queryFn: () => fetch(`/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`).then((res) => res.json()),
    });

    const isDataAvailable = (historyDataQuery.data && historyDataQuery.data.length > 0);


    // TSX to render the component
    return (
        <div className="w-full flex flex-col gap-4 items-start justify-between py-2 px-3 md:px-6">
            <h2 className="text-xl md:text-2xl dark:text-slate-100">History</h2>
                <Card className="!w-full flex flex-col items-center justify-between gap-y-3 gap-x-0 border-none">
                    <CardHeader className="w-full p-0" >
                        <CardTitle className="w-full flex items-center justify-between gap-2" >
                            <HistoryPeriodSelector
                                period={period}
                                setPeriod={setPeriod}
                                timeframe={timeframe}
                                setTimeframe={setTimeframe}
                            />
                            <div className="h-10 gap-2 flex items-center justify-center">
                                <SkeletonWrapper isLoading={historyDataQuery.isFetching} fullWidth={false} >
                                    <Badge variant={"outline"} className="flex items-center justify-center text-xs tracking-wider font-normal gap-1 rounded-md py-1 px-3 cursor-pointer" >
                                        <div className="h-3 w-3 rounded-full bg-emerald-400"></div> Income
                                    </Badge>
                                </SkeletonWrapper>
                                <SkeletonWrapper isLoading={historyDataQuery.isFetching} fullWidth={false} >
                                    <Badge variant={"outline"} className="flex items-center justify-center text-xs tracking-wider font-normal gap-1 rounded-md py-1 px-3 cursor-pointer" >
                                        <div className="h-3 w-3 rounded-full bg-rose-400"></div> Expense
                                    </Badge>
                                </SkeletonWrapper>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="w-full p-0">
                        <SkeletonWrapper isLoading={historyDataQuery.isFetching} fullWidth >
                            {/* If the data is available then show the chart */}
                            {isDataAvailable && (
                                <ResponsiveContainer width={"100%"} className={"h-[300px] md:!h-[500px] p-0"}>
                                    <BarChart height={500} data={historyDataQuery.data} barCategoryGap={5} >
                                        <defs>
                                            <linearGradient id="incomeBar" x1={"0"} y1={"0"} x2={"0"} y2={"1"} >
                                                <stop offset={"0"} stopColor="#10b981" stopOpacity={"1"} />
                                                <stop offset={"1"} stopColor="#10b981" stopOpacity={"0"} />
                                            </linearGradient>
                                            <linearGradient id="expenseBar" x1={"0"} y1={"0"} x2={"0"} y2={"1"} >
                                                <stop offset={"0"} stopColor="#ef4444" stopOpacity={"1"} />
                                                <stop offset={"1"} stopColor="#ef4444" stopOpacity={"0"} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="5 5" strokeOpacity={"0.2"} vertical={false} />

                                        <XAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            padding={{ left: 5, right: 5 }}
                                            dataKey={(data) => {
                                                const { year, month, day } = data;
                                                const date = new Date(year, month, day || 1);
                                                if (timeframe === "year") {
                                                    return date.toLocaleDateString("default", { month: "short" });
                                                } else {
                                                    return date.toLocaleDateString("default", { day: "2-digit" });
                                                }
                                            }}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />

                                        <Bar dataKey={"income"} label={"Income"} fill="url(#incomeBar)" radius={4} className="cursor-pointer" />
                                        <Bar dataKey={"expense"} label={"Encome"} fill="url(#expenseBar)" radius={4} className="cursor-pointer" />

                                        <Tooltip
                                            cursor={{ opacity: 0.1 }}
                                            content={(props) => (
                                                <CustomBarTooltip formatter={formatter} {...props} />
                                            )}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}

                            {/* If data is not available then show some alternate text */}
                            {!isDataAvailable && (
                                <Card className="h-[400px] mt-3 flex flex-col items-center justify-center text-center bg-background" >
                                    No data available for selected Time-frame & Time-period
                                    <p className="text-sm text-muted-foreground">
                                        Try selecting different time frame/period or try adding new transactions
                                    </p>
                                </Card>
                            )}


                        </SkeletonWrapper>
                    </CardContent>
                </Card>
        </div>
    );
};


// A Custom tooltip component to show the information about each bar on our chart we hover
const CustomBarTooltip = ({ active, payload, formatter }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    const data = payload[0].payload;
    const { expense, income } = data;

    return (
        <div className="min-w-[250px] flex flex-col gap-1 rounded border bg-background p-3">
            <TooltipRow formatter={formatter} label="Expense" value={expense} bgColor="bg-rose-400" textColor="text-rose-500" />
            <TooltipRow formatter={formatter} label="Income" value={income} bgColor="bg-emerald-400" textColor="text-emerald-500" />
            <TooltipRow formatter={formatter} label="Balance" value={income - expense} bgColor={(income - expense < 0) ? "bg-rose-400" : "bg-emerald-400"} textColor={(income - expense < 0) ? "text-rose-500" : "text-emerald-500"} />
        </div>
    );
};

// A component to show each row of a Tooltip
const TooltipRow = ({ label, value, bgColor, textColor, formatter }: {
    label: string,
    value: number,
    bgColor: string,
    textColor: string,
    formatter: Intl.NumberFormat
}) => {
    // make a callback to avoid unnecessary re-rendering of ToolTip over a Same X-Value
    const formattingFn = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter]);

    return (
        <div className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", bgColor)} />
            <div className="w-full flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className={cn("text-xs font-semibold", textColor)} >
                    <CountUp
                        preserveValue={true}
                        redraw={false}
                        end={value}
                        delay={.1}
                        duration={.5}
                        formattingFn={formattingFn}
                        className="text-xs"
                    />
                </div>
            </div>
        </div>
    );
}

// Exporting the component
export default History;
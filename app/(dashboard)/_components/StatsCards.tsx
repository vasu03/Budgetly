// To make this a client side component
"use client";

// Impotring required modules
import React, { ReactNode, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// Importing custom data type
import { UserSettings } from "@prisma/client";
import { getBalanceSatsResponseType } from "@/app/api/stats/balance/route";

// Importing custom helper functions
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";

// Importing custom components
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon, HandCoinsIcon, Wallet2Icon, BanknoteIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

// Defining an Interface to define data type of our component props
interface Props {
    userSettings: UserSettings
    from: Date,
    to: Date
}

// Creating our Satistics Cards component to show various statistics
const StatsCards = ({ userSettings, from, to }: Props) => {
    // Making an API call to fetch/GET the Data for statistics cards
    const statsQuery = useQuery<getBalanceSatsResponseType>({
        queryKey: ["overview", "stats", from, to],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
    });

    // An output formatter that formats the output of above query by adding a currency symbol
    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    const currentIncome = statsQuery.data?.currIncome || 0;
    const currentExpense = statsQuery.data?.currExpense || 0;
    const currentBalance = currentIncome - currentExpense;
    const totalIncome = statsQuery.data?.totalIncome || 0;
    const totalExpense = statsQuery.data?.totalExpense || 0;
    const totalBalance = totalIncome - totalExpense;

    // TSX to render the component
    return (
        <div className="relative grid sm:grid-rows-3 md:grid-rows-2 sm:grid-cols-2 md:grid-cols-3 w-full gap-2 py-2 px-3 md:px-6" >
            <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth>
                <StatCard
                    formatter={formatter}
                    value={currentIncome}
                    title="Current Income"
                    icon={
                        <HandCoinsIcon className="h-10 w-10 items-center rounded-md p-2 shrink-0 text-emerald-500 bg-emerald-400/10" />
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth>
                <StatCard
                    formatter={formatter}
                    value={currentExpense}
                    title="Current Expense"
                    icon={
                        <BanknoteIcon className="h-10 w-10 items-center rounded-md p-2 shrink-0 text-rose-500 bg-rose-400/10" />
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth>
                <StatCard
                    formatter={formatter}
                    value={currentBalance}
                    title="Current Balance"
                    icon={
                        <Wallet2Icon
                            className={
                                cn("h-10 w-10 items-center rounded-md p-2 shrink-0",
                                    (currentBalance >= 0) ?
                                        "text-emerald-500 bg-emerald-400/10" :
                                        "text-rose-500 bg-rose-400/10")} />
                    } />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth>
                <StatCard
                    formatter={formatter}
                    value={totalIncome}
                    title="Total Income"
                    icon={
                        <TrendingUpIcon className="h-10 w-10 items-center rounded-md p-2 shrink-0 text-emerald-500 bg-emerald-400/10" />
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth>
                <StatCard
                    formatter={formatter}
                    value={totalExpense}
                    title="Total Expense"
                    icon={
                        <TrendingDownIcon className="h-10 w-10 items-center rounded-md p-2 shrink-0 text-rose-500 bg-rose-400/10" />
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching} fullWidth>
                <StatCard
                    formatter={formatter}
                    value={totalBalance}
                    title="Total Balance"
                    icon={
                        <PiggyBankIcon
                            className={
                                cn("h-10 w-10 items-center rounded-md p-2 shrink-0",
                                    (totalBalance >= 0) ?
                                        "text-emerald-500 bg-emerald-400/10" :
                                        "text-rose-500 bg-rose-400/10")} />
                    } />
            </SkeletonWrapper>
        </div>
    );
};


// A component that render individual statistic card in the above Card container
const StatCard = ({ formatter, value, title, icon }: {
    formatter: Intl.NumberFormat,
    value: number,
    title: string,
    icon: ReactNode
}) => {

    const formatFn = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter]);

    // TSX to render the component
    return (
        <Card className={cn(
            "flex py-4 w-full items-center gap-4 px-4 border-transparent cursor-pointer transition-all duration-500 ease-in-out",
            (value >= 0 && !title.includes("Expense")) ?
                "bg-emerald-400/10 hover:bg-emerald-400/20 hover:scale-[.98]" :
                "bg-rose-400/10 hover:bg-rose-400/20 hover:scale-[.98]")
        }>
            {icon}
            <div className="flex flex-col items-start gap-0">
                <p className="text-sm lg:text-sm text-muted-foreground ">{title}</p>
                <CountUp
                    preserveValue={true}
                    redraw={false}
                    end={value}
                    duration={.8}
                    delay={.3}
                    decimals={2}
                    formattingFn={formatFn}
                    className="text-lg lg:text-xl"
                />
            </div>
        </Card >
    );
};

// Exporting our component
export default StatsCards;
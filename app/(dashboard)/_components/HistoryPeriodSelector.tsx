// To make this a Client Side component
"ues client";

// Importing required moduels
import React from "react";
import { useQuery } from "@tanstack/react-query";

// Importing our custom data types
import { PeriodType, TimeframeType } from "@/lib/types";
import { GetHistoryPeriodResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Defining and interface to get the type of our component props
interface Props {
    period: PeriodType;
    setPeriod: (period: PeriodType) => void;
    timeframe: TimeframeType;
    setTimeframe: (timeframe: TimeframeType) => void;
}

// Creating our History Chart's Period selector component
const HistoryPeriodSelector = ({ period, setPeriod, timeframe, setTimeframe }: Props) => {

    // Make an API call to fetch the history periods
    const historyPeriodQuery = useQuery<GetHistoryPeriodResponseType>({
        queryKey: ["overview", "history", "periods"],
        queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
    });

    // TSx to render the component
    return (
        <div className="flex flex-wrap items-center gap-4 ">
            <SkeletonWrapper isLoading={historyPeriodQuery.isFetching} fullWidth={false} >
                <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as TimeframeType)}>
                    <TabsList>
                        <TabsTrigger value="year">Year</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </SkeletonWrapper>
            <div className="flex flex-wrap items-center gap-2">
                <SkeletonWrapper isLoading={historyPeriodQuery.isFetching} fullWidth={false} >
                    <YearSelector period={period} setPeriod={setPeriod} years={historyPeriodQuery.data || []} />
                </SkeletonWrapper>

                {timeframe === "month" && (
                    <SkeletonWrapper isLoading={historyPeriodQuery.isFetching} fullWidth={false} >
                        <MonthSelector
                            period={period} setPeriod={setPeriod}
                        />
                    </SkeletonWrapper>
                )}
            </div>
        </div>
    );
};


// A component that helps in selectin a year to get the history data
const YearSelector = ({ period, setPeriod, years }: {
    period: PeriodType,
    setPeriod: (period: PeriodType) => void,
    years: GetHistoryPeriodResponseType
}) => {
    return (
        <Select
            value={period.year.toString()}
            onValueChange={(value) => {
                setPeriod({
                    month: period.month,
                    year: parseInt(value),
                });
            }} >
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent >
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()} >{year}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};


// A component that helps in selectin a Month to get the history data
const MonthSelector = ({ period, setPeriod }: {
    period: PeriodType,
    setPeriod: (period: PeriodType) => void,
}) => {
    return (
        <Select
            value={period.month.toString()}
            onValueChange={(value) => {
                setPeriod({
                    month: parseInt(value),
                    year: period.year,
                });
            }} >
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
                    const monthStr = new Date(period.year, month, 1).toLocaleDateString("default", {month: "long"});
                    return (
                    <SelectItem key={month} value={month.toString()} >{monthStr}</SelectItem>
                )})}
            </SelectContent>
        </Select>
    );
};

// Exporting the component
export default HistoryPeriodSelector;
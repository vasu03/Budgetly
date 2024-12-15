// To make this a Client side component
"use client";

// Importing required modules
import React, { useState } from "react";
import { differenceInDays, startOfMonth } from "date-fns";

// Importing custom data types
import { UserSettings } from "@prisma/client";

// Importing pre-defined UI components
import { toast } from "sonner";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Importing custom Constants
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";

// Importing custom components
import StatsCards from "./StatsCards";
import CategoryWiseStats from "./CategoryWiseStats";

// Creating our Data Overview component
const Overview = ({ userSettings }: { userSettings: UserSettings }) => {
    // Some states to handle the data & manage to working of component
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    // TSX to render our component
    return (
        <>
            <div className="w-full flex flex-wrap items-center justify-between py-2 px-3 md:px-6">
                <h2 className="text-xl md:text-2xl dark:text-slate-100">Overview</h2>
                <div className="flex items-center">
                    <DateRangePicker
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={(values) => {
                            const { from, to } = values.range;
                            if (!from || !to) return;
                            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                                toast.error(`Date range must be less than ${MAX_DATE_RANGE_DAYS} days.`);
                                return;
                            }
                            setDateRange({ from, to });
                        }}
                    />
                </div>
            </div>

            {/* The cards to show income, expense & balance in given date range */}
            <StatsCards
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
            />

            {/* Category wise Income and expense Overview stats */}
            <CategoryWiseStats
                userSettings={userSettings}
                from={dateRange.from}
                to={dateRange.to}
            />
        </>
    );
};

// Exporting our data Overview component
export default Overview;
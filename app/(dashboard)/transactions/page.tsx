// To make it as a Client component
"use client";

// Importing required modules
import React, { useState } from "react";
import { differenceInDays, startOfMonth } from "date-fns";

// Importing pre-defined UI components
import { toast } from "sonner";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Importing custom Constants
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";

// Importing custom components
import TransactionsTable from "./_components/TransactionsTable";

// Creating our Transactions page
const Page = () => {
    // Some states to handle the data & manage to working of component
    const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    // TSX to render the page
    return (
        <div className="w-full h-full bg-background">
            <div className="w-full flex flex-col items-start gap-y-4 py-2 px-3 md:px-6">
                {/* Page heading & Date range picker */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between">
                    <div className="flex flex-col items-start gap-y-1 py-2">
                        <h2 className="font-semibold text-xl md:text-2xl dark:text-slate-100">Transactions</h2>
                        <p className="text-[10px] md:text-xs font-normal text-muted-foreground tracking-wider">Manage your transactions here.</p>
                    </div>
                    <div className="flex h-max items-center justify-center">
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

                {/* Transactions table to show the transactions */}
                <TransactionsTable from={dateRange.from} to={dateRange.to} />
            </div>
        </div>
    );
};

// Exporting our page
export default Page;
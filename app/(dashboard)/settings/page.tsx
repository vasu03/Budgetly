// To make this a Client side component
"use client";

// Importing required modules 
import React from "react";
import { useQuery } from "@tanstack/react-query";

// Importing pre-defined UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon, BanknoteIcon, Trash2Icon } from "lucide-react";

// Importing custom components
import CurrencyList from "@/components/CurrencyList";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";

// Importing custom data types
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";


// Creating our Settings Page
const page = () => {
    // TSX to render the page
    return (
        <>
            <div className="w-full h-full bg-background">
                <div className="w-full flex flex-col items-start gap-y-4 py-2 px-3 md:px-6">
                    {/* Page heading and sub-heading */}
                    <div className="flex flex-col items-start gap-y-1 py-2">
                        <h2 className="font-semibold text-xl md:text-2xl dark:text-slate-100">Account Settings</h2>
                        <p className="text-[10px] md:text-xs font-normal text-muted-foreground tracking-wider">Manage your account settings and preferences here.</p>
                    </div>

                    {/* Default currency settings card */}
                    <Card className="w-full py-3 flex flex-col sm:flex-row justify-start sm:justify-between gap-y-2 px-4 md:px-6">
                        <CardHeader className="flex items-start gap-x-2 p-0 space-y-0">
                            <CardTitle className="flex items-center gap-x-2">
                                <BanknoteIcon className="bg-blue-400/20 stroke-blue-500 rounded-md items-center w-10 h-10 py-2 px-2" />
                                <div className="flex flex-col justify-self-center">
                                    <span className="text-base sm:text-lg md:text-xl font-semibold">Currency</span>
                                    <span className="text-[10px] md:text-xs font-normal text-muted-foreground tracking-wider leading-4 sm:leading-normal">Set your default currency for transactions.</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center !p-0 sm:w-[125px] md:w-[140px]">
                            <CurrencyList />
                        </CardContent>
                    </Card>

                    {/* Settings for Income and Expense categories */}
                    <div className="w-full grid grid-rows-2 grid-cols-1 gap-y-4">
                        <CategoryList type={"income"} />
                        <CategoryList type={"expense"} />
                    </div>
                </div>
            </div >
        </>
    );
};


// A component to show all the categories based on their type (income/expense)
const CategoryList = ({ type }: { type: TransactionType }) => {
    // Make an API call to fetch the User categories
    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    });

    const isDataAvailable = (categoriesQuery.data && categoriesQuery.data.length > 0);

    return (
        <SkeletonWrapper isLoading={categoriesQuery.isFetching} fullWidth={false} >
            <Card className="flex flex-col !w-full gap-0">
                <CardHeader className="w-full flex py-3 px-4 md:px-6">
                    <CardTitle className="grid grid-rows-2 sm:grid-rows-1 grid-cols-1 sm:grid-cols-2 gap-y-3">
                        <div className="flex items-center gap-x-2">
                            {type === "income" ? (
                                <TrendingUpIcon className="bg-emerald-400/20 stroke-emerald-500 rounded-md items-center w-10 h-10 p-2" />
                            ) : (
                                <TrendingDownIcon className="bg-red-400/20 stroke-red-500 rounded-md items-center w-10 h-10 p-2" />
                            )}
                            <div className="flex flex-col">
                                <span className="text-base sm:text-lg md:text-xl font-semibold">
                                    {type === "income" ? "Income " : "Expense "}
                                    categories
                                </span>
                                <span className="text-[10px] md:text-xs font-normal text-muted-foreground tracking-wider">Sorted by name</span>
                            </div>
                        </div>
                        <div className="justify-self-end">
                            <CreateCategoryDialog type={type} successCallback={() => categoriesQuery.refetch()} />
                        </div>
                    </CardTitle>
                </CardHeader>

                {/* Show alternate text if the categories data is not available */}
                {!isDataAvailable && (
                    <div className="h-[160px] w-full flex flex-col items-center justify-center">
                        <span className="text-sm sm:font-base text-center font-normal tracking-wide px-1 text-gray-700 dark:text-gray-200" >
                            No data available for {type} categories
                        </span>
                        <span className="text-[10px] sm:text-xs text-center text-muted-foreground font-normal px-1 tracking-wider" >
                            Get started by adding a new {type} category from here
                        </span>
                    </div>
                )}

                {/* Show the categories data if the data is available */}
                {isDataAvailable && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row p-2 gap-2">
                        {categoriesQuery.data.map((category: Category) => (
                            <CategoryCard category={category} key={category.name} />
                        ))}
                    </div>
                )}
            </Card>
        </SkeletonWrapper>
    );
};


// A component to render each individual category as a Card
const CategoryCard = ({ category }: { category: Category }) => {
    return (
        <Card className="flex items-center justify-between rounded-md">
            <div className="flex px-2 rounded-[inherit] items-center gap-2">
                <span role="img" className="text-2xl md:text-xl lg:text-2xl">{category.icon}</span>
                <span className="text-sm lg:text-base">{category.name}</span>
            </div>

            <DeleteCategoryDialog
                category={category}
                trigger={
                    <Button variant={"secondary"} className="rounded-l-none rounded-r-md text-muted-foreground hover:bg-rose-500/20 hover:text-rose-500/90 transition-all durtion-300" >
                        <Trash2Icon className="" />
                    </Button>
                } />
        </Card>
    );
};

// Exporting our Settings page
export default page;
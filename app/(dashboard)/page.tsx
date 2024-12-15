// Importing required modulesfont-bold
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

// Importing  custom components
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";

// Creating a Page for our Dashboard
const page = async () => {
    // grab the current user from clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // Get the data related to current user from db
    const userSettings = await prisma.userSettings.findUnique({ where: { userId: currUser.id } });
    if (!userSettings) redirect("/wizard");

    // TSX to render the page
    return (
        <div className="h-full w-full bg-background" >
            {/* Greeting and Action buttons container to create new transactions */}
            <div className="bg-card flex items-center justify-center w-full">
                <div className="w-full flex flex-wrap items-center justify-evenly sm:justify-between gap-3 md:gap-6 py-2 px-3 md:px-6">
                    {/* Greetings for the User */}
                    <p className="text-lg lg:text-2xl font-semibold">
                        Hey,&nbsp;
                        <span className="bg-gradient-to-tr from-teal-500 via-zinc-300 to-cyan-400 bg-clip-text text-2xl lg:text-3xl font-semibold leading-tight tracking-tighter text-transparent">
                            {currUser.firstName}
                        </span>
                    </p>
                    {/* Two actions buttons to Add a new Transaction */}
                    <div className="flex items-center gap-3">
                        <CreateTransactionDialog
                            type="income"
                            trigger={
                                <button
                                    type="button"
                                    className="
                                        py-[0.3rem] md:py-[0.4rem] px-2 md:px-4 rounded-md
                                        bg-green-300 hover:bg-green-500 text-gray-900
                                        dark:bg-teal-800 dark:hover:bg-teal-600 dark:text-white 
                                        transition-all duration-500 text-xs md:text-sm " >New Income</button>
                            } />
                        <CreateTransactionDialog
                            type="expense"
                            trigger={
                                <button
                                    type="button"
                                    className="
                                    py-[0.3rem] md:py-[0.4rem] px-2 md:px-4 rounded-md
                                    bg-red-400 hover:bg-red-500 dark:text-white
                                    dark:bg-rose-500 !bg-opacity-50 hover:!bg-opacity-80 
                                    transition-all duration-500 text-xs md:text-sm" >
                                    New Expense
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Overview information container */}
            <Overview userSettings={userSettings} />
        </div>
    );
};

// Exporting the Dashboard Page
export default page;
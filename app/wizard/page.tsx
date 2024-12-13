// /Importing required modules
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Importing pre-defined UI components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

// Importing custom components
import Logo from "@/components/Logo";
import CurrencyList from "@/components/CurrencyList";


// Creating a page for the wizard
const page = async () => {
    // Get the current user
    const currUser = await currentUser();
    if (!currUser) { redirect("/sign-in"); }

    // TSX to render the Page
    return (
        <div className="container w-[90%] md:max-w-2xl flex flex-col items-center justify-between gap-2" >
            <div className="mb-4 flex items-center justify-center">
                <Logo />
            </div>

            {/* Container to show Welcome Text */}
            <h1 className="text-center text-xl md:text-3xl">
                Welcome aboard,
                <span className="ml-1 bg-gradient-to-r from-teal-500 via-pink-300 to-cyan-400 bg-clip-text text-2xl md:text-4xl font-bold leading-tight tracking-tighter text-transparent" >
                    {currUser.firstName}
                </span> !
            </h1>

            {/* Container to show description text */}
            <div className="w-full flex flex-col items-center ">
                <h2 className="text-center text-sm md:text-base text-muted-foreground" >
                    Let &apos;s get started by setting up your Currency.
                </h2>
                <h3 className="text-center text-xs md:text-sm text-muted-foreground" >
                    You can change these settings at any time !
                </h3>
            </div>

            <Separator className="my-2" />

            {/* Card to show selection of Currency */}
            <Card className="w-full p-4 mb-2">
                <CardTitle className="text-xl md:text-2xl">Currency</CardTitle>
                <CardDescription className="text-xs md:text-base" >Set a default currency for your transactions</CardDescription>
                <CardContent className="p-0 mt-2">
                    <CurrencyList />
                </CardContent>
            </Card>

            {/* Submit button to proceed further */}
            <Button className="w-full text-base font-medium" >
                <Link href={"/"} className="w-full h-full" >
                    All set & ready to go!
                </Link>
            </Button>
        </div>
    );
};


// Exporting the Wizard page
export default page;
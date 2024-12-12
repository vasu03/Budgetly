// To make SwitchTheme a Client side component
"use client";

// Importing required modules
import React from "react";
import { useTheme } from "next-themes";

// Importing icons from Lucide
import { Moon, Sun } from "lucide-react";

// Importing pre-define ui components
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// Creating our Switch Theme button component
const SwitchTheme = () => {
    // A hook to set a theme for the App
    const { setTheme } = useTheme();

    // TSX to render the component
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="focus:outline-none">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Switch theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// Exporting our component
export default SwitchTheme;

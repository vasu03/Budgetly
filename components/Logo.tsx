// Importing required modules
import React from "react";

// Importing the Icons from Lucide
import { Wallet } from "lucide-react";

// Creating our Logo component for Desktop screens
const Logo = () => {
    // TSX to render our Logo component
    return (
        <a href="/" className="flex items-center gap-2" aria-label="Home">
            <Wallet className="h-8 w-8 stroke stroke-teal-400 stroke-[1.5]" />
            <span className="bg-gradient-to-r from-teal-500 via-pink-300 to-cyan-400 bg-clip-text text-3xl font-semibold leading-tight tracking-tight text-transparent" >
                Budgetly
            </span>
        </a>
    );
};

// Creating our Logo component for Mobile screens
export const LogoMobile = () => {
    // TSX to render our Logo component
    return (
        <a href="/" className="flex items-center gap-2" aria-label="Home">
            <span className="bg-gradient-to-r from-teal-500 via-pink-300 to-cyan-400 bg-clip-text text-2xl font-semibold leading-tight tracking-tight text-transparent" >
                Budgetly
            </span>
        </a>
    );
};

// Exporting our Logo component
export default Logo;
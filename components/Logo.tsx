// Importing required modules
import React from "react";

// Importing the Icons from Lucide
import { Wallet } from "lucide-react";

// Creating our Logo component
const Logo = () => {

    // TSX to render our Logo component
    return (
        <a href="/" className="flex items-center gap-2" aria-label="Home">
            <Wallet className="h-10 w-10 stroke stroke-teal-400 stroke-[1.5]" />
            <span className="bg-gradient-to-r from-teal-500 via-pink-300 to-cyan-400 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent" >
                Budgetly
            </span>
        </a>
    );
};

// Exporting our Logo component
export default Logo;
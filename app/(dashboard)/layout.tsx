// Impomrting required modules
import React, { ReactNode } from "react";

// Importing custom components
import Navbar from "@/components/Navbar";

// Creating the Layout for Dashboard
const layout = ({ children }: { children: ReactNode }) => {

    // TSX to render the layout
    return (
        <div className="relative w-full-h-screen flex flex-col">
            {/* Render the Navbar component */}
            <Navbar />
            {/* Render the Dashboard Page */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

// Exporting our Dashboard Layout
export default layout;
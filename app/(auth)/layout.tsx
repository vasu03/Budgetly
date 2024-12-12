// Importing required modules
import Logo from "@/components/Logo";
import React, { ReactNode } from "react";

// Creating a Layout for Authentication
const layout = ({children} : {children: ReactNode}) => {

    // TSX to render the layout
    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center" >
            <Logo />
            <div className="mt-12">
                {children}
            </div>
        </div>
    );
};

// Exporting our page
export default layout;
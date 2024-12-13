// Importing required modules
import React, { ReactNode } from "react";

// Creating a layout for Currency selection Wizard
const layout = ({ children }: { children: ReactNode }) => {

    // TSX to render the wizard layout
    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center" >
            {children}
        </div>
    );
};

// Exporting the Wizard Layout
export default layout;
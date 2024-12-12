// To make this a Clien Side component
"use client";

import { ThemeProvider } from "next-themes";
// Importing required modules
import React, { ReactNode } from "react";

// Creating our Root Provider component
const RootProviders = ({children} : {children: ReactNode}) => {

    // TSX to render the component
    return (
        <ThemeProvider 
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
};

// Exporting our Root provider component
export default RootProviders;
// To make this a Clien Side component
"use client";

// Importing required modules
import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; 
import { ThemeProvider } from "next-themes";

// Creating our Root Provider component
const RootProviders = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({}));

    // TSX to render the component
    return (
        <QueryClientProvider client={queryClient} >
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

// Exporting our Root provider component
export default RootProviders;
// Importing required modules
import React, { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

// Creating a SkeletonWrapper component used for Loading animation
const SkeletonWrapper = ({children, isLoading, fullWidth = true} : {
    children: ReactNode; 
    isLoading: boolean;
    fullWidth: boolean;
}) => {
    
    if(!isLoading) return children;



    // TSX to render the component
    return (
        <Skeleton className={cn(fullWidth && "w-full")} >
            <div className="opacity-0">
                {children}
            </div>
        </Skeleton>
    );
};

// Exporting our component
export default SkeletonWrapper;
// To make this as a Client component
"use client";

// Importing required modules
import React from "react";

// Importing pre-defined UI components
import { Settings2 } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";

// Defining the interface for the component props
interface DataTableViewOptionsProps<TData> {
    table: Table<TData>; // TanStack Table instance for managing columns
}

// creating our DataTableViewOptions component TO provides view options for toggling table columns
const DataTableViewOptions = <TData,>({ table }: DataTableViewOptionsProps<TData>) => {
    return (
        <DropdownMenu>
            {/* Dropdown trigger button */}
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8 flex" >
                    <Settings2 /> View
                </Button>
            </DropdownMenuTrigger>

            {/* Dropdown content for toggling columns */}
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Iterating over all columns to render toggle checkboxes */}
                {table.getAllColumns().filter(
                    (column) =>
                        typeof column.accessorFn !== "undefined" && column.getCanHide()).map((column) => (
                            <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)} >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// Exporting the DataTableViewOptions component
export default DataTableViewOptions;

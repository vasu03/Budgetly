// To make this as a Client component
"use client";

// Importing required modules
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// Importing pre-defined UI components for table and headers
import { DownloadIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/datatable/ColumnHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";

// Importing custom UI components
import DeleteTxnDialog from "./DeleteTxnDialog";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import DataTableViewOptions from "@/components/datatable/ColumnToggle";
import { DataTableFacetedFilter } from "@/components/datatable/FacetedFilters";

// Importing helper functions for date conversion
import { DateToUTCDate } from "@/lib/helpers";

// Importing custom data types for transactions API response
import { getTransactionsDataResponseType } from "@/app/api/transactions-data/route";

// Importing pre-defined utility dependency
import { download, generateCsv, mkConfig } from "export-to-csv";



// Defining the Props interface for component inputs
interface Props {
    from: Date,     // Start date for transactions
    to: Date        // End date for transactions
};

// Defining the data type for each transaction row
type TransactionDataRow = getTransactionsDataResponseType[0];

// Placeholder for empty data
const emptyData: any[] = [];

// Defining the columns structure for the transactions table
const columns: ColumnDef<TransactionDataRow>[] = [
    {
        accessorKey: "category",        // Key for category column
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        // Custom filter logic for category column
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => (
            // Display the Category Icon and Category Name for a Txn
            <div className="flex gap-2 capitalize">
                {row.original.categoryIcon}
                <div className="capitalize">{row.original.category}</div>
            </div>
        ),
    },
    {
        accessorKey: "type",            // Key for transaction type column
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Txn Type" />
        ),
        // Custom filter logic for transaction type
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => (
            // Display the txn type as Income or Expense
            <div className={cn("capitalize", row.original.type === "income" ? "text-emerald-400" : "text-rose-400")}>
                {row.original.type}
            </div>
        ),
    },
    {
        accessorKey: "amount",          // Key for amount column
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            // Display formatted amount in targetted User currency format
            <div className={cn("capitalize", row.original.type === "income" ? "text-emerald-400" : "text-rose-400")}>
                {row.original.formattedAmount}
            </div>
        ),
    },
    {
        accessorKey: "date",            // Key for date column
        header: "Date",
        cell: ({ row }) => {
            // Format date to a user-friendly format
            const date = new Date(row.original.date);
            const formattedDate = date.toLocaleDateString("default", {
                timeZone: "UTC",
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
            return (
                // Display the formatted Date
                <div className="text-muted-foreground">
                    {formattedDate}
                </div>
            );
        },
    },
    {
        accessorKey: "description",     // Key for description column
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            // Display the Description for a Txn
            <div className="capitalize">
                {row.original.description}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            // Display the action buttons
            <RowActions transaction={row.original} />
        ),
    },
];

// Setting up the configs for the Export to CSV button
const csvConfig = mkConfig({
    filename: "Budgetly",
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
});

// Creating our component for rendering the Transactions Table
const TransactionsTable = ({ from, to }: Props) => {
    // State to manage sorting in the table
    const [sorting, setSorting] = useState<SortingState>([]);
    // State to manage column filters in the table
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Fetch transaction data using a React Query
    const txnQuery = useQuery<getTransactionsDataResponseType>({
        // Cache key for faster query retrievel
        queryKey: ["transactions", "history", from, to],
        // Query function that make the API request to fetch data
        queryFn: () => fetch(`/api/transactions-data?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
    });

    // A function to handle the Export to CSV feature
    const handleExportCSV = (data: any[]) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    // Initialize the React Table instance
    const table = useReactTable({
        data: txnQuery.data || emptyData,               // Use fetched data or fallback to empty data
        columns,                                        // Table columns definition
        getCoreRowModel: getCoreRowModel(),             // Core row model
        initialState: {
            pagination: {                               // Set the initial page size for pagination
                pageSize: 15
            },
        },
        state: { sorting, columnFilters },              // Table state management
        onSortingChange: setSorting,                    // Handle sorting changes
        onColumnFiltersChange: setColumnFilters,        // Handle filter changes
        getSortedRowModel: getSortedRowModel(),         // Sorting logic
        getFilteredRowModel: getFilteredRowModel(),     // Filtering logic
        getPaginationRowModel: getPaginationRowModel()  // Table pagination logic
    });

    // Extract unique categories for category filter options
    const categoryFilterOptions = useMemo(() => {
        // Store akk the categories in a Map
        const categoriesMap = new Map();
        // loop through each category to store in Map
        txnQuery.data?.forEach((txn) => {
            categoriesMap.set(txn.category, {
                value: txn.category,
                label: `${txn.categoryIcon} ${txn.category}`,
            });
        });
        // Return unique categories by first storing them into Set & returning the set as Array
        return Array.from(new Set(categoriesMap.values()));
    }, [txnQuery.data]);

    // TSX to render the transactions table component
    return (
        <div className="w-full">
            {/* Filters and view options */}
            <div className="grid sm:flex grid-flow-row sm:flex-wrap sm:items-end sm:justify-between gap-0 sm:gap-2">
                <div className="flex items-center gap-2 py-3 pl-1">
                    <span className="text-muted-foreground">Filters: </span>
                    {/* Filter button for Txn Category */}
                    {table.getColumn("category") && (
                        <DataTableFacetedFilter
                            title="Category"
                            column={table.getColumn("category")}
                            options={categoryFilterOptions}
                        />)}
                    {/* Filter button for Txn Type */}
                    {table.getColumn("type") && (
                        <DataTableFacetedFilter
                            title="Txn Type"
                            column={table.getColumn("type")}
                            options={[
                                { label: "Income", value: "income" },
                                { label: "Expense", value: "expense" },
                            ]}
                        />)}
                </div>
                <div className="flex items-center justify-center gap-2 py-3">
                    {/* Button to View and hide specific columns in table  */}
                    <DataTableViewOptions table={table} />
                    {/* Button to Export the table data as a CSV file */}
                    <Button variant={"outline"} size={"sm"} onClick={() => {
                        const data = table.getFilteredRowModel().rows.map((row) => ({
                            CATEGORY: row.original.category,
                            TXN_TYPE: row.original.type,
                            AMOUNT: row.original.formattedAmount,
                            DATE: new Date(row.original.date).toLocaleDateString("default", {
                                timeZone: "UTC",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }),
                            DESCRIPTION: row.original.description
                        }));
                        handleExportCSV(data);
                    }} className="ml-auto h-8 flex" >
                        <DownloadIcon /> Export to CSV
                    </Button>
                </div>
            </div>
            {/* Table skeleton for loading state */}
            <SkeletonWrapper isLoading={txnQuery.isFetching} fullWidth>
                <div className="rounded-md border">
                    <Table>
                        {/* Table header */}
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? (null) : (flexRender(header.column.columnDef.header, header.getContext()))}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        {/* Table body */}
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    {/* Alternate text for no data */}
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Table Pagination buttons */}
                <div className="flex items-center justify-center sm:justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </SkeletonWrapper>
        </div>
    );
};


// A component to show the Table Row action button
const RowActions = ({ transaction }: { transaction: TransactionDataRow }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteTxnDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} txnId={transaction.id} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"sm"} >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={
                            () => { setShowDeleteDialog((prev) => !prev) }
                        }
                        className="flex items-center justify-center gap-2 hover:!bg-rose-500/20 hover:!text-rose-500 hover:cursor-pointer" >
                        <Trash2Icon /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};


// Exporting the TransactionsTable component
export default TransactionsTable;

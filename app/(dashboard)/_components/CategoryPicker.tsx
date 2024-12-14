// To make this a client component
"use client";

// Importing required modules
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// Importing custom data types
import { Category } from "@prisma/client";
import { TransactionType } from "@/lib/types";

// Importing pre-defined UI components
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Importing custom components
import CreateCategoryDialog from "./CreateCategoryDialog";

// Defining an Interface to define data type of our component
interface Props {
    type: TransactionType;
    onChange: (value: string) => void;
}

// Creating our Transaction Category picker list component
const CategoryPicker = ({ type, onChange }: Props) => {
    // Some state to handle working of Picker list
    const [isopen, setIsOpen] = useState(false);
    const [value, setValue] = useState("");

    // An effect to handle updation of category in the form when the value of it changes
    useEffect(() => {
        if (!value) return;
        onChange(value);
    }, [onChange, value]);

    // Making an API call to fetch/GET the Category data via useQuery hook
    const categoryQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    });

    // to get the selected category
    const selectedCategory = categoryQuery.data?.find((category: Category) => category.name === value);

    // A callback function that triggers on success of selection of a new category creation
    // to directly set the newly created category on the select category combobox field 
    const successCallback = useCallback((category: Category) => {
        setValue(category.name);
        setIsOpen((prev) => !prev);
    }, [setValue, setIsOpen]);

    // TSx to render our component
    return (
        <Popover open={isopen} onOpenChange={setIsOpen} >
            <PopoverTrigger asChild>
                <Button variant={"outline"} role="combobox" aria-expanded={isopen} className="w-[200px] font-normal fkex items-center justify-between gap-2" >
                    {selectedCategory ? <CategoryRow category={selectedCategory} /> : "Select category"}
                <ChevronsUpDown className="!w-4 !h-4 stroke-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command onSubmit={(e:any) => e.preventDefault()} >
                    <CommandInput  />
                    <CreateCategoryDialog type={type} successCallback={successCallback} />
                    {/* alternate text if not category exist */}
                    <CommandEmpty>
                        <p>Category not found</p>
                        <p className="text-xs text-muted-foreground">Tip: Create new category.</p>
                    </CommandEmpty>
                    {/* List the available categories for a txn type */}
                    <CommandGroup>
                        <CommandList>
                            {categoryQuery.data && categoryQuery.data.map((category: Category) => (
                                <CommandItem
                                    key={category.name}
                                    onSelect={() => {
                                        setValue(category.name);
                                        setIsOpen(prev => !prev)
                                    }}>
                                    <CategoryRow category={category} />
                                    <Check 
                                        className={cn(
                                            "mx-2 opacity-0 !stroke-2 !h-6 !w-6 stroke-emerald-500", 
                                            value === category.name && "opacity-95"
                                        )} 
                                    />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};


// An Category Row component to show the Categories in Popover list
const CategoryRow = ({ category }: { category: Category }) => {
    return (
        <div className="flex-items-center gap-2">
            <span role="img">{category.icon}</span>
            <span>{category.name}</span>
        </div>
    );
};


// Exporting our component
export default CategoryPicker;
// To make CurrencyList as a Client side component
"use client";

// Importing required modules
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// Importing pre-defined UI components
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

// Importing custom hooks for media queries
import useMediaQuery from "@/hooks/use-media-quey";

// Impomrting custom data types
import { UserSettings } from "@prisma/client";
import { Currencies, Currency } from "@/lib/currencies";

// Importing custom components
import SkeletonWrapper from "./SkeletonWrapper";

// Importing custom api action functions for making API calls
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";


// Creating the CurrencyList component
const CurrencyList = () => {
    // State to control the visibility of popover or drawer
    const [open, setOpen] = useState(false);

    // Using a custom hook to check if the screen size is desktop
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // State to store the currently selected currency option
    const [selectedOption, setselectedOption] = useState<Currency | null>(null);

    // Making an API call to fetch/GET the User data via useQuery hook
    const userSettings = useQuery<UserSettings>({
        queryKey: ["userSettings"],
        queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
    });

    // An effect to set the currency of user 
    useEffect(() => {
        // return if the user data is not available
        if (!userSettings) return;
        // compare the currencies for the user
        const userCurrency = Currencies.find((currency) => currency.value === userSettings.data?.currency);
        if (userCurrency) setselectedOption(userCurrency);
    }, [userSettings.data]);

    // Making an API call to update/PUT the user data via useMutation hook
    const mutation = useMutation({
        mutationFn: UpdateUserCurrency,
        onSuccess: (data: UserSettings) => {
            toast.success("Currency updated successfully", { id: "update-currency" });
            setselectedOption(
                Currencies.find(c => c.value === data.currency) || null
            )
        },
        onError: (e) => {
            console.log(e);
            toast.error("Currency update failed", { id: "update-currency" });
        },
    });

    // A function to mutate the value of currency when selected
    const selectCurrencyOption = useCallback((currency: Currency | null) => {
        if (!currency) {
            toast.error("Please select a currency.");
            return;
        }

        toast.loading("Updating currency...", { id: "update-currency" });
        mutation.mutate(currency.value);
    }, [mutation]);

    // Render the Popover UI for desktop screens
    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={userSettings.isFetching} fullWidth >
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="w-full border">
                        <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                            {selectedOption ? <>{selectedOption.label}</> : <>▼ Set Currency</>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        {/* Render the list of currency options */}
                        <OptionsList setOpen={setOpen} setselectedOption={selectCurrencyOption} />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        );
    }

    // Render the Drawer UI for non-desktop(mobile) screens
    return (
        <SkeletonWrapper isLoading={userSettings.isFetching} fullWidth >
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                        {selectedOption ? <>{selectedOption.label}</> : <>▼ Set Currency</>}
                    </Button>
                </DrawerTrigger>
                <DrawerTitle></DrawerTitle>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        {/* Render the list of currency options */}
                        <OptionsList setOpen={setOpen} setselectedOption={selectCurrencyOption} />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    );
};

// Component to render the list of currency options
const OptionsList = (
    { setOpen, setselectedOption }: {
        setOpen: (open: boolean) => void,
        setselectedOption: (status: Currency | null) => void
    }) => {
    return (
        <Command>
            {/* Input for filtering the list of currencies */}
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                {/* Display message when no results are found */}
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {/* Map through the list of currencies and render each as a CommandItem */}
                    {Currencies.map((currency: Currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value: string) => {
                                // Set the selected currency and close the popover/drawer
                                setselectedOption(
                                    Currencies.find((priority) => priority.value === value) || null
                                );
                                setOpen(false);
                            }}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
};

// Exporting the CurrencyList component for use in other parts of the application
export default CurrencyList;

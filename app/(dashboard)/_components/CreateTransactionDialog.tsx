// To make this a Client side component
"use client";

// Importing required modules
import React, { ReactNode, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Importing pre-defined UI components
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Importing custom components
import CategoryPicker from "./CategoryPicker";

// Importing custom data types
import { TransactionType } from "@/lib/types";

// Importing custom validation schemas
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transactionSchema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar1Icon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

// Importing custom api action functions for making API calls
import { CreateTransaction } from "../_actions/transactions";
import { toast } from "sonner";

// Importing custom helper functions
import { DateToUTCDate } from "@/lib/helpers";

// Defining an Interface to define data type of our component
interface Props {
    trigger: ReactNode;
    type: TransactionType;
}


// Creating our Create New Txn Dialog box component
const CreateTransactionDialog = ({ trigger, type }: Props) => {
    // some states to manage working of the dialog data
    const [isOpen, setIsOpen] = useState(false);

    // Create a form using the React-hook-form and zod
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type: type,
            date: new Date(),
            description: "",
            amount: 0
        }
    });

    // A function to handle the change in category for a txn and update the form
    const handleCategoryChangeCallback = useCallback((value: string) => {
        if (form.getValues("category") !== value) {
            form.setValue("category", value);
        }
    }, [form]);

    // Defining a query client to update all the transaction data throughout the app
    const queryClient = useQueryClient();

    // Making an API mutation call to create the category
    const { mutate, isPending, error } = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: async () => {
            toast.success(`Transaction created successfully.`, {
                id: "create-transaction"
            });
            form.reset({
                type,
                description: "",
                amount: 0,
                date: new Date(),
                category: undefined,
            });
            queryClient.invalidateQueries({
                queryKey: ["overview"],
            });

            setIsOpen((prev) => !prev);
        }
    });

    // function to handle the submission of the form
    const onFormSubmit = useCallback((values: CreateTransactionSchemaType) => {
        toast.loading("Creating transaction...", {
            id: "create-transaction"
        });
        mutate({
            ...values,
            date: DateToUTCDate(values.date),
        });
    }, [mutate]);

    // TSX to render the component
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        Create a new &nbsp;
                        <span className={cn("!text-2xl", type === "income" ? "text-teal-500" : "text-rose-400")}>{type}</span>.
                    </DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-3 flex flex-col">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input className="h-8 !rounded-sm" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs" >Description of Transaction(optional)</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount<span className="text-rose-400"> *</span></FormLabel>
                                    <FormControl>
                                        <Input className="h-8 !rounded-sm" type="number" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs" ></FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-between gap-2">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Category<span className="text-rose-400 mr-2"> *</span></FormLabel>
                                        <FormControl>
                                            <CategoryPicker type={type} onChange={handleCategoryChangeCallback} />
                                        </FormControl>
                                        <FormDescription className="text-xs" ></FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Txn Date<span className="text-rose-400 mr-2"> *</span></FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild >
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[200px] text-left font-normal text-[13px] flex items-center justify-between gap-2",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pich a Date</span>
                                                        )}
                                                        <Calendar1Icon className="!w-4 !h-4 stroke-muted-foreground" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(value) => {
                                                        if (!value) return;
                                                        field.onChange(value);
                                                    }}
                                                    initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription className="text-xs" ></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                {/* To close or Cancel the creation of new category */}
                <DialogFooter >
                    <DialogClose asChild >
                        <Button type="button" variant={"secondary"} onClick={() => form.reset()} >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={form.handleSubmit(onFormSubmit)}
                        disabled={isPending}
                    >
                        {!isPending ? "Save" : <Loader2 className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Exporting the component
export default CreateTransactionDialog;
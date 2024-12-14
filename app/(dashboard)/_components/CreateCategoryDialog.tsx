// To make this a client side component
"use client";

// Importing required modules
import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";

// Importing custom types and validation types 
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categorySchema";

// Importing pre-defined UI components
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Importing Icons & emoji selector
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

// Importing custom api action functions for making API calls
import { CreateCategory } from "../_actions/categories";

// Defining an Interface to define data type of our component
interface Props {
    type: TransactionType;
    successCallback: (category: Category) => void;
}

// Creating our Create New Txn Category Dialog component
const CreateCategoryDialog = ({ type, successCallback }: Props) => {
    // to define the themes of independent components
    const theme = useTheme();

    // Some states to handle the working of the component
    const [isOpen, setIsOpen] = useState(false);

    // Create a form using the React-hook-form and zod
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
            name: "",
        },
    });

    // Defining a query client to update all the category data throughout the app
    const queryClient = useQueryClient();

    // Making an API mutation call to create the category
    const { mutate, isPending, error } = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
            form.reset({ name: "", icon: "", type });
            toast.success(`Category ${data.name} created successfully.`, {
                id: "create-category"
            });

            // call the success callback to directly set the newly created category
            successCallback(data);

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setIsOpen((prev) => !prev);
        },

        onError: () => {
            toast.error("Category creation failed.", {
                id: "create-category"
            });
            console.log(error);
        }
    });

    // function to handle the submission of the form
    const onFormSubmit = useCallback((values: CreateCategorySchemaType) => {
        toast.loading("Creating category...", {
            id: "create-category"
        });
        mutate(values);
    }, [mutate]);

    // TSX to render our component
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            {/* To open a dialog box for creating a new Category */}
            <DialogTrigger asChild>
                <Button variant={"ghost"} className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground" >
                    <PlusSquare className="mr-2 h-4 w-4" /> New category
                </Button>
            </DialogTrigger>
            {/* Content of triggered Dialog box */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new{" "}
                        <span className={cn("!text-2xl mx-1", type === "income" ? "text-teal-500" : "text-rose-400")} >{type}</span>
                        {" "}category
                    </DialogTitle>
                    <DialogDescription>
                        Categories are used to group your transactions.
                    </DialogDescription>
                </DialogHeader>
                {/* Form to set a new category and its data */}
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8" >
                        {/* To set the Name of category */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name<span className="text-rose-400"> *</span></FormLabel>
                                    <FormControl>
                                        <Input type="text" className="h-8 !rounded-sm" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs" ></FormDescription>
                                </FormItem>
                            )}
                        />
                        {/* To set a icon for the category */}
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon<span className="text-rose-400"> *</span></FormLabel>
                                    <FormControl>
                                        {/* Show a Emoji selection popover to select a icon */}
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className="h-[100px] w-full"
                                                >
                                                    {form.watch("icon") ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-4xl" role="img" >{field.value}</span>
                                                            <span className="text-muted-foreground font-light text-xs" >Click to change.</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2" >
                                                            <CircleOff className="!h-[38px] !w-[38px] stroke stroke-muted-foreground" />
                                                            <span className="text-muted-foreground font-light text-xs" >No icon selected. Click to select one.</span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full z-[1000] p-1 " >
                                                <Picker
                                                    data={data}
                                                    previewPosition={"none"}
                                                    navPosition={"bottom"}
                                                    theme={theme.resolvedTheme}
                                                    onEmojiSelect={(emoji: { native: string }) => { field.onChange(emoji.native) }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription className="text-xs" ></FormDescription>
                                </FormItem>
                            )}
                        />
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
            <DialogDescription></DialogDescription>
        </Dialog>
    );
};

// Exporting the component
export default CreateCategoryDialog;
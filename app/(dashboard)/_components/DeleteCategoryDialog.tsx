// To make it as a Client side component
"use client";

// Importing required modules
import React, { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Importing pre-defined UI components
import { toast } from "sonner";
import { AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Importing our custom data types
import { Category } from "@prisma/client";
import { TransactionType } from "@/lib/types";

// Importing custom api action functions for making API calls
import { DeleteCategory } from "../_actions/categories";

// Defining an interface for the data type of our component props
interface Props {
    trigger: ReactNode,
    category: Category
};

// Creating our Delete Category Dialog box component
const DeleteCategoryDialog = ({ trigger, category }: Props) => {
    // Defining a query client to update all the category data throughout the app
    const queryClient = useQueryClient();

    // Making an API mutation call to create the category
    const deleteCategoryMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async (data: Category) => {

            toast.success("Category deleted successfully.", {
                id: "delete-category"
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },

        onError: () => {
            toast.error("Category deletion failed.", {
                id: "delete-category"
            });
        }
    });
    // TSX to render the component
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to delete {category.name} category?</AlertDialogTitle>
                    <AlertDescription className="text-muted-foreground text-sm" >The effects of this action can't be undone. Your category will be deleted permanantly.</AlertDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        toast.loading(`Deleting ${category.name} category`, {
                            id: "delete-category"
                        });
                        deleteCategoryMutation.mutate({
                            name: category.name,
                            type: category.type as TransactionType
                        });
                    }} >Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// Exporting the component
export default DeleteCategoryDialog;
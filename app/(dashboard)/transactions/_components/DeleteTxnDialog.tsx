// To make this a Client side component
"use client";

// Importing required modules
import React from "react";

// Importing pre-defined UI components
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Importing custom api action functions for making API calls
import { DeleteTransaction } from "../_actions/transactions";


// Defining the Props for the component
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    txnId: string;
};

// Creating our Delete a Transaction Dialog box
const DeleteTxnDialog = ({ open, setOpen, txnId }: Props) => {
    // Defining a query client to update all the category data throughout the app
    const queryClient = useQueryClient();

    // Making an API mutation call to Delete a Transaction
    const deleteTransactionMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async () => {

            toast.success("Transaction deleted successfully.", {
                id: "delete-transaction"
            });

            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
        },

        onError: () => {
            toast.error("Transaction deletion failed.", {
                id: "delete-transaction"
            });
        }
    });
    // TSX to render the component
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to delete this transaction</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-sm" >The effects of this action can not be undone. Your transaction will be deleted permanantly.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        toast.loading(`Deleting Transaction`, {
                            id: "delete-transaction"
                        });
                        deleteTransactionMutation.mutate(txnId);
                    }} >Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// Exporting our component
export default DeleteTxnDialog;
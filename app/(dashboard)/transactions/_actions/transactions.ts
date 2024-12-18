// Make this Server sided to use Server Actions
"use server";

// Importing required modules
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Create and export a function to Delete a existing Transaction in db
export const DeleteTransaction = async (txnId: string) => {
    // grab the current user details using clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // Find the transaction to be deleted
    const transaction = await prisma.transaction.findUnique({
        where: {
            userId: currUser.id,
            id: txnId
        },
    });

    if (!transaction) throw new Error("Transaction not found.");

    // Delete a the target transaction from all the Tables using DB-Transaction query
    await prisma.$transaction([
        // Delete the targeted txn from Transactions table
        prisma.transaction.delete({
            where: {
                userId: currUser.id,
                id: txnId,
            },  
        }),

        // Update the month history table
        prisma.monthHistory.update({
            where: {
                day_month_year_userId: {
                    userId: currUser.id,
                    day: transaction.date.getUTCDate(),
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === "income" && {
                    income: {
                        decrement: transaction.amount,
                    }
                }),
            },
        }),

        // Update the year history table
        prisma.yearHistory.update({
            where: {
                month_year_userId: {
                    userId: currUser.id,
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === "income" && {
                    income: {
                        decrement: transaction.amount,
                    }
                }),
            },
        }),
    ]);
};
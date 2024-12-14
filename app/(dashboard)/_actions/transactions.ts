// Make this Server sided to use Server Actions
"use server";

// Importing required modules
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// Importing custom validation schemas
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transactionSchema";


// Create and export a function to Create a new Transaction in db
export const CreateTransaction = async (form: CreateTransactionSchemaType) => {
    // validate the data to be updated
    const parsedbody = CreateTransactionSchema.safeParse(form);

    // throw an error if validation fails
    if (!parsedbody.success) throw new Error(parsedbody.error.message);

    // grab the current user details using clerk
    const currUser = await currentUser();
    if (!currUser) redirect("/sign-in");

    // extract the incoming data and push it into DB
    const { description, amount, category, date, type } = parsedbody.data;

    // validate the incoming category
    const categoryRow = await prisma.category.findFirst({
        where: { userId: currUser.id, name: category }
    });
    if (!categoryRow) throw new Error("Category not found.");


    // perform an DBMS transaction (ACID) in order to create a txn and update all aggregates using the txn
    await prisma.$transaction([
        // Create a new user transaction
        prisma.transaction.create({
            data: {
                userId: currUser.id,
                description: description || "",
                amount: amount,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
                date: date,
                type: type
            }
        }),

        // updating aggregates tables (monthHistory and yearHistory)
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: currUser.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                // if a row is not existing then create one  
                userId: currUser.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                // if a row is already existing then just update  
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            },
        }),
        
        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: currUser.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                // if a row is not existing then create one  
                userId: currUser.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                // if a row is already existing then just update  
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            },
        }),
    ]);

    // return the created data as response
    return category;
};
// The file containing some helper functions for the main app

// Importing requred data and other lib modules
import { Currencies } from "./currencies";


// A function to convert a given into a UTC Date format
export const DateToUTCDate = (date: Date) => {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        ),
    );
};


// A function to format the txn balance data by adding a currency symbol ahead of it
export const GetFormatterForCurrency = (currency: string) => {
    // Get the locale name for the obtained currency type/value
    const locale = Currencies.find((c) => c.value === currency)?.locale;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    });
};
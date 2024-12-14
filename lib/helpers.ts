// The file containing some helper functions for the main app

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
        )
    );
};
export const Currencies = [
    { value: "INR", label: "₹ Rupee", locale: "en-IN" },
    { value: "GBP", label: "£ Pound", locale: "en-GB" },
    { value: "EUR", label: "€ Euro", locale: "de-DE" },
    { value: "USD", label: "$ Dollar", locale: "en-US" },
];

export type Currency = (typeof Currencies)[0];

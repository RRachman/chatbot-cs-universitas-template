import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                "slide-in": {
                    "0%": { opacity: 0, transform: "translateX(100%)" },
                    "100%": { opacity: 1, transform: "translateX(0)" },
                },
            },
            animation: {
                "slide-in": "slide-in 0.35s ease-out forwards",
            },
        },
    },

    plugins: [forms],
};

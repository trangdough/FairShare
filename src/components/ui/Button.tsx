import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    ...props
}: ButtonProps) {
    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md border-0 font-medium",
        secondary:
            "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
        danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-medium",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}

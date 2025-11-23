import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "card-elevated rounded-3xl p-6 card-elevated-hover",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

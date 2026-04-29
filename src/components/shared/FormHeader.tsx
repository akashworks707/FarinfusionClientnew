"use client";

import React from "react";
import { PencilLine, Plus } from "lucide-react";

type FormHeaderProps = {
    title: string;
    description?: string;
    type: "create" | "update";
};

export default function FormHeader({
                                       title,
                                       description,
                                       type,
                                   }: FormHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                {type === "create" ? (
                    <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                    <PencilLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
            </div>

            {/* Text */}
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    );
}
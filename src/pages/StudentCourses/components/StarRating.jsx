// src/pages/StudentCourses/components/StarRating.jsx
import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ value, onChange, readonly = false }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
                <button
                    key={s}
                    onClick={() => !readonly && onChange(s)}
                    className={readonly ? "cursor-default" : "transition-transform hover:scale-110"}
                    disabled={readonly}
                >
                    <Star className={`size-6 ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                </button>
            ))}
        </div>
    );
}
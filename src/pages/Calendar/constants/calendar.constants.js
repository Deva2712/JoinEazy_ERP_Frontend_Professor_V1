import { BookOpen, FlaskConical, Palmtree, Users, User } from "lucide-react";

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export const EVENT_TYPES = {
    class: {
        label: "Class",
        color: "bg-blue-500",
        light: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        icon: BookOpen,
    },
    exam: {
        label: "Exam",
        color: "bg-red-500",
        light: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        icon: FlaskConical,
    },
    holiday: {
        label: "Holiday",
        color: "bg-green-500",
        light: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        icon: Palmtree,
    },
    meeting: {
        label: "Meeting",
        color: "bg-purple-500",
        light: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        icon: Users,
    },
    personal: {
        label: "Personal",
        color: "bg-amber-500",
        light: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        icon: User,
    },
};
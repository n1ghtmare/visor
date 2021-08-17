import { differenceInDays, format, formatDistanceToNow } from "date-fns";

export function parseDateFromServer(date: string): Date {
    if (date) {
        return typeof date === "string" ? new Date(date) : date;
    }

    return null;
}

export function generateTimestampText(date: Date) {
    console.log({ date });
    if (typeof date === "string") {
        date = parseDateFromServer(date);
    }

    const days: number = differenceInDays(new Date(), date);

    if (days > 3) {
        return format(date, "d LLL ''yy");
    }

    return formatDistanceToNow(date, { addSuffix: true });
}

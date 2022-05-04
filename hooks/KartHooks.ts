import useSWR from "swr";

import fetcher from "helpers/fetcher";
import { Kart } from "@prisma/client";

export function useKarts(eventId: number, currentUserId?: number) {
    const url = eventId && currentUserId ? `/api/events/${eventId}/karts` : null;
    const { data, error, isValidating, mutate } = useSWR<Kart[]>(url, fetcher);

    return {
        karts: data,
        isLoading: !error && !data,
        isError: error,
        isValidating,
        mutate
    };
}

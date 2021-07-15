import useSWR from "swr";

import fetcher from "helpers/fetcher";

import Kart from "entities/Kart";

export function useKarts(eventId: number) {
    const { data, error, isValidating } = useSWR<Kart[]>(
        eventId ? `/api/events/${eventId}/karts` : null,
        fetcher
    );

    return {
        karts: data,
        isLoading: !error && !data,
        isError: error,
        isValidating
    };
}

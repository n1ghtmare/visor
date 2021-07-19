import useSWR from "swr";

import fetcher from "helpers/fetcher";

import Pit from "entities/Pit";

export function usePits(eventId: number) {
    const { data, error, isValidating } = useSWR<Pit[]>(
        eventId ? `/api/events/${eventId}/pits` : null,
        fetcher
    );

    return {
        pits: data,
        isLoading: !error && !data,
        isError: error,
        isValidating
    };
}

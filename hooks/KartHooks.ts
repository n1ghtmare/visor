import fetcher from "helpers/fetcher";
import useSWR from "swr";

import Kart from "entities/Kart";

export function useKarts(eventId: number) {
    const { data, error, isValidating } = useSWR<Kart[]>(`/api/events/${eventId}/karts`, fetcher);

    return {
        karts: data,
        isLoading: !error && !data,
        isError: error,
        isValidating
    };
}

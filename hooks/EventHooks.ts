import fetcher from "helpers/fetcher";
import useSWR from "swr";

import EventComposite from "entities/EventComposite";

export function useEventComposites() {
    const { data, error, isValidating } = useSWR<EventComposite[]>(
        "/api/events/composite",
        fetcher
    );

    return {
        events: data,
        isLoading: !error && !data,
        isError: error,
        isValidating
    };
}

import fetcher from "helpers/fetcher";
import useSWR from "swr";

import EventComposite from "entities/EventComposite";
import Event from "entities/Event";

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

export function useEvent(id: number) {
    const { data, error, isValidating } = useSWR<Event>(id ? `/api/events/${id}` : null, fetcher);

    return {
        event: data,
        isLoading: !error && !data,
        isError: error,
        isValidating
    };
}

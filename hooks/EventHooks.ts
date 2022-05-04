import useSWR from "swr";

import fetcher from "helpers/fetcher";

import EventComposite from "entities/EventComposite";
import { Event } from "@prisma/client";

// we're passing the currentUserId in order to determine whether we should make the call at all
export function useEventComposites(currentUserId?: number) {
    const { data, error, isValidating } = useSWR<EventComposite[]>(
        currentUserId ? "/api/events/composite" : null,
        fetcher
    );

    return {
        events: data,
        isLoading: !error && !data,
        isError: error,
        isValidating
    };
}

export function useEvent(id: number, currentUserId?: number) {
    const { data, error, isValidating } = useSWR<Event>(
        id && currentUserId ? `/api/events/${id}` : null,
        fetcher
    );

    return {
        event: data,
        isLoading: !error && !data,
        isError: error,
        isValidating
    };
}

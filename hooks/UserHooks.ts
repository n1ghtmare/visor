import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

import fetcher from "helpers/fetcher";

import UserComposite from "entities/UserComposite";

export function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
    const { data: user, mutate: mutateUser } = useSWR<UserComposite>("/api/user", fetcher);

    useEffect(() => {
        // if no redirect needed, just return (example: user is already logged on /events)
        // if user data not yet there (fetch is in progress, logged in or not), don't do anything yet
        if (!redirectTo || !user) {
            return;
        }

        if (
            // if redirect to is set, redirect if the user was found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // if redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ) {
            Router.push(redirectTo);
        }
    }, [user, redirectIfFound, redirectTo]);

    return { user, mutateUser };
}

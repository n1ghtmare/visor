import { GetStaticPropsContext } from "next";
import Head from "next/head";
import React from "react";

import { useKarts } from "hooks/KartHooks";
import { useEvent } from "hooks/EventHooks";

import LoadingIndicator from "components/Shared/LoadingIndicator";
import RefetchingIndicator from "components/Shared/RefetchingIndicator";

export async function getServerSideProps(context: GetStaticPropsContext) {
    // TODO: Should we validate the id and throw an error if it's not a number?
    const { id } = context.params;
    const eventId = parseInt(id as string, 10);

    if (isNaN(eventId)) {
        throw Error("Invalid id");
    }

    return {
        props: { id: eventId }
    };
}

export default function EventDetails({ id }: { id: number }) {
    console.log({ id });
    const {
        karts,
        isLoading: isLoadingKarts,
        isError: isErrorKarts,
        isValidating: isValidatingKarts
    } = useKarts(id);

    const {
        event,
        isLoading: isLoadingEvent,
        isError: isErrorEvent,
        isValidating: isValidatingEvent
    } = useEvent(id);

    if (isErrorKarts || isErrorEvent) {
        return (
            <div className="text-center">
                <strong>Error:</strong> Failed to load data...
            </div>
        );
    }

    if (isLoadingKarts || isLoadingEvent) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <Head>
                <title>Visor - Event </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main role="main">
                <h1 className="text-4xl font-bold tracking-tight">{event.name}</h1>
                <div className="mt-12">
                    <div>Karts will be displayed here</div>
                </div>
                {(isValidatingKarts || isValidatingEvent) && <RefetchingIndicator />}
            </main>
        </>
    );
}

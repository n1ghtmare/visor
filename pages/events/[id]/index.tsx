import { GetStaticPropsContext } from "next";
import Head from "next/head";
import React, { useState } from "react";

import { useKarts } from "hooks/KartHooks";
import { useEvent } from "hooks/EventHooks";

import StatusType from "entities/StatusType";

import LoadingIndicator from "components/Shared/LoadingIndicator";
import RefetchingIndicator from "components/Shared/RefetchingIndicator";
import Button from "components/Shared/Button";
import KartsTableBox from "components/KartsTableBox";
import KartsTableIdle from "components/KartsTableIdle";
import KartsTableRacing from "components/KartsTableRacing";

export async function getServerSideProps(context: GetStaticPropsContext) {
    const { id } = context.params;
    const eventId = parseInt(id as string, 10);

    // TODO: Should we validate the id and throw an error if it's not a number?
    if (isNaN(eventId)) {
        throw Error("Invalid id");
    }

    return {
        props: { id: eventId }
    };
}

export default function EventDetails({ id }: { id: number }) {
    const [statusType, setStatusType] = useState<StatusType>(StatusType.Racing);

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

    const filteredKarts = karts.filter((x) => x.statusType === statusType);

    console.log({ karts }, { filteredKarts });

    function renderKartsTable() {
        switch (statusType) {
            case StatusType.Idle:
                return <KartsTableIdle karts={filteredKarts} />;

            case StatusType.Racing:
                return <KartsTableRacing karts={filteredKarts} />;

            case StatusType.Box:
                return <KartsTableBox karts={filteredKarts} />;
        }
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
                    <div>
                        <Button onClick={() => setStatusType(StatusType.Racing)}>Racing</Button>
                        <Button onClick={() => setStatusType(StatusType.Idle)}>Idle</Button>
                        <Button onClick={() => setStatusType(StatusType.Box)}>In Box</Button>
                    </div>
                    {renderKartsTable()}
                </div>
                {(isValidatingKarts || isValidatingEvent) && <RefetchingIndicator />}
            </main>
        </>
    );
}

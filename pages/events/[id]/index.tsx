import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import { useKarts } from "hooks/KartHooks";
import { useEvent } from "hooks/EventHooks";

import StatusType from "entities/StatusType";
import Kart from "entities/Kart";

import { groupedMapByStatusType } from "helpers/data";

import LoadingIndicator from "components/Shared/LoadingIndicator";
import RefetchingIndicator from "components/Shared/RefetchingIndicator";
import IconFlag from "components/Shared/IconFlag";
import IconStop from "components/Shared/IconStop";
import IconAdjustments from "components/Shared/IconAdjustments";
import IconArrowSmLeft from "components/Shared/IconArrowSmLeft";
import LinkAnchor from "components/Shared/LinkAnchor";
import KartsTablePit from "components/KartsTablePit";
import KartsTableIdle from "components/KartsTableIdle";
import KartsTableRacing from "components/KartsTableRacing";
import LinkPill from "components/EventDetails/LinkPill";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { id, status } = context.query;
    const eventId = parseInt(id as string, 10);

    // TODO: Should we validate the id and throw an error if it's not a number?
    if (isNaN(eventId)) {
        throw Error("Invalid id");
    }

    return {
        props: { id: eventId, status: status || null }
    };
}

function parseStatus(status: string): StatusType {
    switch (status) {
        case "racing":
            return StatusType.Racing;
        case "idle":
            return StatusType.Idle;
        case "pit":
            return StatusType.Pit;
        default:
            return null;
    }
}

export default function EventDetails({ id, status }: { id: number; status?: string }) {
    const [statusType, setStatusType] = useState<StatusType>(StatusType.Racing);

    useEffect(() => {
        setStatusType(parseStatus(status) || StatusType.Racing);
    }, [status]);

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

    const grouped: Map<StatusType, Kart[]> = groupedMapByStatusType(karts);

    function renderKartsTable() {
        const filteredKarts = grouped.get(statusType);
        switch (statusType) {
            case StatusType.Idle:
                return <KartsTableIdle karts={filteredKarts} />;

            case StatusType.Racing:
                return <KartsTableRacing karts={filteredKarts} />;

            case StatusType.Pit:
                return <KartsTablePit karts={filteredKarts} />;
        }
    }

    return (
        <>
            <Head>
                <title>Visor - Event / {event.name}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main role="main">
                <div className="flex items-end">
                    <h1 className="flex-1 text-4xl font-bold tracking-tight">{event.name}</h1>
                    <LinkAnchor href="/events">
                        <IconArrowSmLeft />
                        <span>back to all events</span>
                    </LinkAnchor>
                </div>
                <div className="mt-12">
                    <div className="flex space-x-3">
                        <LinkPill
                            isSelected={statusType === StatusType.Racing}
                            href={`/events/${id}?status=racing`}
                        >
                            <IconFlag />
                            <span>Racing</span>
                            <span>({grouped.get(StatusType.Racing).length})</span>
                        </LinkPill>
                        <LinkPill
                            isSelected={statusType === StatusType.Pit}
                            href={`/events/${id}?status=pit`}
                        >
                            <IconAdjustments />
                            <span>In Pit</span>
                            <span>({grouped.get(StatusType.Pit).length})</span>
                        </LinkPill>
                        <LinkPill
                            isSelected={statusType === StatusType.Idle}
                            href={`/events/${id}?status=idle`}
                        >
                            <IconStop />
                            <span>Idle</span>
                            <span>({grouped.get(StatusType.Idle).length})</span>
                        </LinkPill>
                    </div>
                </div>
                <div className="mt-4">{renderKartsTable()}</div>
                {(isValidatingKarts || isValidatingEvent) && <RefetchingIndicator />}
            </main>
        </>
    );
}

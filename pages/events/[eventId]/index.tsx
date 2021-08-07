import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { mutate } from "swr";

import { useKarts } from "hooks/KartHooks";
import { useEvent } from "hooks/EventHooks";
import { groupedMapByPitId, groupedMapByStatusType } from "helpers/data";

import StatusType from "entities/StatusType";
import Kart from "entities/Kart";

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
import useUser from "hooks/UserHooks";
import Layout from "components/Shared/Layout";
import { usePits } from "hooks/PitHooks";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { eventId, status } = context.query;
    const id = parseInt(eventId as string, 10);

    // TODO: Should we validate the id and throw an error if it's not a number?
    if (isNaN(id)) {
        throw Error("Invalid id");
    }

    return {
        props: { id, status: status || null }
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

async function updateKart(kart: Kart): Promise<void> {
    const response = await fetch(`/api/events/${kart.eventId}/karts/${kart.id}`, {
        method: "PUT",
        body: JSON.stringify(kart),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(response.status.toString());
    }

    await response.json();
}

export default function EventDetails({ id, status }: { id: number; status?: string }) {
    const [statusType, setStatusType] = useState<StatusType>(StatusType.Racing);
    const { user } = useUser({ redirectTo: "/login" });

    useEffect(() => {
        setStatusType(parseStatus(status) || StatusType.Racing);
    }, [status]);

    const {
        karts,
        isLoading: isLoadingKarts,
        isError: isErrorKarts,
        isValidating: isValidatingKarts
    } = useKarts(id, user?.id);

    const {
        event,
        isLoading: isLoadingEvent,
        isError: isErrorEvent,
        isValidating: isValidatingEvent
    } = useEvent(id, user?.id);

    const { pits, isLoading: isLoadingPits, isError: isErrorPits } = usePits(id);

    if (isErrorKarts || isErrorEvent || isErrorPits) {
        return (
            <Layout pageTitle="Visor - Loading data..." shouldDisplayHeader={false}>
                <div className="text-center">
                    <strong>Error:</strong> Failed to load data...
                </div>
            </Layout>
        );
    }

    if (isLoadingKarts || isLoadingEvent || isLoadingPits || !user?.isLoggedIn) {
        return (
            <Layout pageTitle="Visor - Loading data..." shouldDisplayHeader={false}>
                <LoadingIndicator />
            </Layout>
        );
    }

    async function handleEditConfirm(kart: Kart) {
        const kartsApiUrl = `/api/events/${id}/karts`;

        mutate(
            kartsApiUrl,
            karts.map((x) => (x.id === kart.id ? kart : x)),
            false
        );

        await updateKart(kart);

        // Mutate all karts from server (sync)
        mutate(kartsApiUrl);
    }

    const grouped: Map<StatusType, Kart[]> = groupedMapByStatusType(karts);

    function renderKartsTable() {
        const filteredKarts = grouped.get(statusType);

        if (statusType === StatusType.Racing) {
            return (
                <KartsTableRacing
                    karts={filteredKarts}
                    pits={pits}
                    onEditConfirm={handleEditConfirm}
                />
            );
        }

        const eventNosInUse = karts.filter((x) => x.eventNo !== null).map((x) => x.eventNo);

        if (statusType === StatusType.Pit) {
            const groupedPit = groupedMapByPitId(filteredKarts);
            const groupedPitKeys = Array.from(groupedPit.keys());

            return (
                <KartsTablePit
                    karts={filteredKarts}
                    pits={pits}
                    onEditConfirm={handleEditConfirm}
                    eventNosInUse={eventNosInUse}
                />
            );
        }

        return (
            <KartsTableIdle
                karts={filteredKarts}
                pits={pits}
                onEditConfirm={handleEditConfirm}
                eventNosInUse={eventNosInUse}
            />
        );
    }

    return (
        <Layout pageTitle={`Visor - Event / ${event.name}`}>
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
        </Layout>
    );
}

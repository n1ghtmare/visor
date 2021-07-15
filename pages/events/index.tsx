import Head from "next/head";
import { mutate } from "swr";

import { useEventComposites } from "hooks/EventHooks";

import LoadingIndicator from "components/Shared/LoadingIndicator";
import RefetchingIndicator from "components/Shared/RefetchingIndicator";
import EventsTable from "components/EventsTable";
import EventsTableBody from "components/EventsTableBody";
import EventsTableEmptyRow from "components/EventsTableEmptyRow";
import EventsTableFooter from "components/EventsTableFooter";
import EventsTableHeader from "components/EventsTableHeader";
import EventsTableRow from "components/EventsTableRow";

async function deleteEvent(id: number): Promise<void> {
    const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(response.status.toString());
    }

    await response.json();
}

export default function Index() {
    const { events, isLoading, isError, isValidating } = useEventComposites();

    async function handleDeleteConfirm(id: number) {
        mutate(
            "/api/events/composite",
            events.filter((x) => x.id !== id),
            false
        );

        await deleteEvent(id);

        mutate("/api/events/composite");
    }

    if (isError) {
        return (
            <div className="text-center">
                <strong>Error:</strong> Failed to load data...
            </div>
        );
    }

    if (isLoading) return <LoadingIndicator />;

    return (
        <>
            <Head>
                <title>Visor - List Events</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main role="main">
                <h1 className="text-4xl font-bold tracking-tight">Events</h1>

                <div className="mt-12">
                    <EventsTable>
                        {events.length > 0 && <EventsTableHeader />}
                        <EventsTableBody>
                            {events.length === 0 ? (
                                <EventsTableEmptyRow />
                            ) : (
                                events.map((x) => (
                                    <EventsTableRow
                                        key={x.id}
                                        event={x}
                                        onDeleteConfirm={handleDeleteConfirm}
                                    />
                                ))
                            )}
                        </EventsTableBody>
                        <EventsTableFooter />
                    </EventsTable>
                </div>
                {isValidating && <RefetchingIndicator />}
            </main>
        </>
    );
}

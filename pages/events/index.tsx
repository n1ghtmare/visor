import Head from "next/head";

import { useEventsComposite } from "hooks/EventHooks";

import LoadingIndicator from "components/Shared/LoadingIndicator";
import RefetchingIndicator from "components/Shared/RefetchingIndicator";
import EventsTable from "components/EventsTable";
import EventsTableBody from "components/EventsTable/EventsTableBody";
import EventsTableEmptyRow from "components/EventsTable/EventsTableBody/EventsTableEmptyRow";
import EventsTableRow from "components/EventsTable/EventsTableBody/EventsTableRow";
import EventsTableFooter from "components/EventsTable/EventsTableFooter";
import EventsTableHeader from "components/EventsTable/EventsTableHeader";

export default function Index() {
    const { events, isLoading, isError, isValidating } = useEventsComposite();

    if (isError) return <div>Failed to load data...</div>;
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
                                        name={x.name}
                                        noOfKartsInBox={x.noOfKartsInBox}
                                        noOfKartsInRace={x.noOfKartsInRace}
                                        noOfKartsIdle={x.noOfKartsIdle}
                                        noOfBoxes={x.noOfBoxes}
                                        noOfKartsTotal={x.noOfKartsTotal}
                                        createdOnDate={x.createdOnDate}
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

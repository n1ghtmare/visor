import Head from "next/head";
import useSWR from "swr";

import fetcher from "helpers/fetcher";
import EventSummary from "entities/EventSummary";

import EventsTable from "components/EventsTable";
import EventsTableBody from "components/EventsTable/EventsTableBody";
import EventsTableEmptyRow from "components/EventsTable/EventsTableBody/EventsTableEmptyRow";
import EventsTableRow from "components/EventsTable/EventsTableBody/EventsTableRow";
import EventsTableFooter from "components/EventsTable/EventsTableFooter";
import EventsTableHeader from "components/EventsTable/EventsTableHeader";

export default function Index() {
    const { data, error } = useSWR<EventSummary[]>("/api/event", fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

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
                        {data.length > 0 && <EventsTableHeader />}
                        <EventsTableBody>
                            {data.length === 0 ? (
                                <EventsTableEmptyRow />
                            ) : (
                                data.map((x) => (
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
            </main>
        </>
    );
}

import Head from "next/head";
import useSWR from "swr";

import fetcher from "helpers/fetcher";
import Race from "entities/Race";

export default function Index() {
    const { data, error } = useSWR<Race[]>("/api/race", fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Head>
                <title>Visor - List Races</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="w-1/2">
                <h1 className="text-4xl font-bold">Will list all the races here</h1>
                <div>Listing the races one by one...</div>

                {data && data.map((x) => <div key={x.id}>{x.name}</div>)}
            </main>
        </>
    );
}

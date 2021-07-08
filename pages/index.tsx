import Head from "next/head";

import IconArrowNarrowRight from "components/Shared/IconArrowNarrowRight";
import LinkButton from "components/Shared/LinkButton";

export default function Home() {
    return (
        <>
            <Head>
                <title>Visor</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="text-center">
                <h1 className="text-6xl font-bold">Welcome to Visor</h1>

                <p className="mt-3 text-2xl">
                    This is the place where you can setup and track racing events.
                </p>

                <div className="mt-12">
                    <LinkButton href="/events">
                        <IconArrowNarrowRight />
                        <span>View Events</span>
                    </LinkButton>
                </div>
            </main>
        </>
    );
}

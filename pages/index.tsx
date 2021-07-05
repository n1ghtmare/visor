import Head from "next/head";
import Link from "next/link";

import IconArrowNarrowRight from "components/Shared/IconArrowNarrowRight";

export default function Home() {
    return (
        <>
            <Head>
                <title>Visor</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
                <h1 className="text-6xl font-bold">Welcome to Visor</h1>

                <p className="mt-3 text-2xl">Get started by setting up a racing event</p>

                <div className="mt-12">
                    <Link href="/setup">
                        <a className="flex items-center px-4 py-2 text-xl font-bold text-white bg-blue-600 rounded hover:bg-blue-700 space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                            <IconArrowNarrowRight />
                            <span>Setup Event</span>
                        </a>
                    </Link>
                </div>
            </main>
        </>
    );
}

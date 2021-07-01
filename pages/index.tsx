import Head from "next/head";
import Link from "next/link";

function IconArrowNarrowRight() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
            />
        </svg>
    );
}

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

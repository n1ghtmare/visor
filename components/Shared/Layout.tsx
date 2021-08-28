import Head from "next/head";
import React, { PropsWithChildren } from "react";

import Header from "./Layout/Header";

// if it's loading data, don't show the header
export default function Layout({
    children,
    pageTitle = "Visor",
    shouldDisplayHeader = true
}: PropsWithChildren<{ pageTitle?: string; shouldDisplayHeader?: boolean }>) {
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {shouldDisplayHeader && <Header />}

            <div className="flex flex-col items-center ">
                <div className="py-20 w-full px-8 lg:px-0 lg:mx-auto lg:w-9/12">{children}</div>
            </div>
        </>
    );
}

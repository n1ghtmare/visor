import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
            <div className="mx-4 lg:mx-auto lg:w-9/12">
                <Component {...pageProps} />
            </div>
        </div>
    );
}

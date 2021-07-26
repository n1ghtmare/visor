import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="bg-gray-200">
            <Component {...pageProps} />
        </div>
    );
}

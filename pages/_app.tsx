import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Component {...pageProps} />
        </div>
    );
}
export default MyApp;

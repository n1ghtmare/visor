import "tailwindcss/tailwind.css";

// TODO: See if we can remove the tippy.css and replace it with tailwind only
import "tippy.js/dist/tippy.css";

import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="bg-gray-200">
            <Component {...pageProps} />
        </div>
    );
}

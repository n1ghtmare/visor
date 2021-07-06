import Link from "next/link";

export default function LinkButton(props: React.PropsWithChildren<{ href: string }>) {
    return (
        <Link href={props.href}>
            <a className="inline-flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                {props.children}
            </a>
        </Link>
    );
}

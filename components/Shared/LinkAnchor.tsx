import Link from "next/link";

export default function LinkAnchor(
    props: React.PropsWithChildren<{ href: string; isDisabled?: boolean }>
) {
    return (
        <Link href={props.href}>
            <a className="inline-flex items-center text-blue-600 space-x-1 hover:text-blue-800 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                {props.children}
            </a>
        </Link>
    );
}

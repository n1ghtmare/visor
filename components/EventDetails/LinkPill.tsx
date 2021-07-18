import Link from "next/link";

export default function LinkPill(
    props: React.PropsWithChildren<{ href: string; isSelected?: boolean }>
) {
    return (
        <Link href={props.href}>
            <a
                className={`inline-flex items-center px-4 py-2 font-bold rounded space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    props.isSelected ? "bg-gray-300" : "hover:bg-gray-300"
                }`}
            >
                {props.children}
            </a>
        </Link>
    );
}

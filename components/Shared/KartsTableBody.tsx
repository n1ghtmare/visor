export default function KartsTableBody(props: React.PropsWithChildren<Record<never, never>>) {
    return <tbody className="bg-white divide-y divide-gray-200">{props.children}</tbody>;
}

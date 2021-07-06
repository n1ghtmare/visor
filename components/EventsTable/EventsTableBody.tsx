export default function EventsTableBody(props: React.PropsWithChildren<{}>) {
    return <tbody className="bg-white divide-y divide-gray-200">{props.children}</tbody>;
}

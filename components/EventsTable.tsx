export default function EventsTable(props: React.PropsWithChildren<Record<never, never>>) {
    return (
        <div className="overflow-hidden border border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">{props.children}</table>
        </div>
    );
}

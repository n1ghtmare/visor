export default function KartsTable(props: React.PropsWithChildren<Record<never, never>>) {
    return (
        <div className="overflow-hidden border border-gray-300 shadow sm:rounded">
            <table className="min-w-full divide-y divide-gray-200">{props.children}</table>
        </div>
    );
}

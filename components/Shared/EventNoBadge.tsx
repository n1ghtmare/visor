export default function EventNoBadge({ value }: { value: number }) {
    if (!value) {
        return <span>-</span>;
    }

    return (
        <div className="inline-flex px-3 py-2 font-bold leading-none bg-white border border-gray-400 rounded shadow-sm">
            {value}
        </div>
    );
}

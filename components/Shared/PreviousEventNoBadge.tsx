export default function PreviousEventNoBadge({ value }: { value: number }) {
    if (!value) {
        return <span>-</span>;
    }

    return (
        <div className="inline-flex px-3 py-2 font-bold leading-none text-gray-500 bg-white border border-gray-300 rounded shadow-sm">
            {value}
        </div>
    );
}

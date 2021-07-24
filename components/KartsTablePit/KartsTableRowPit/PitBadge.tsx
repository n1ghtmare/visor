export default function PitBadge({ name, colorHex }: { name: string; colorHex: string }) {
    return (
        <div className="inline-flex items-center font-bold leading-none border border-gray-400 rounded shadow-sm">
            <div className="px-3 py-2">{name || "..."}</div>
            <div style={{ backgroundColor: colorHex }} className="w-5 h-5 mr-2 rounded"></div>
        </div>
    );
}

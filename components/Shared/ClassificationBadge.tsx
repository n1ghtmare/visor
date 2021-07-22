import ClassificationType from "entities/ClassificationType";

export default function ClassificationBadge({ value }: { value: ClassificationType }) {
    if (!value) {
        return <span>-</span>;
    }

    if (value === ClassificationType.SlowAF) {
        return (
            <div className="inline-flex px-3 py-2 font-bold leading-none bg-red-200 rounded shadow-sm">
                Slow AF
            </div>
        );
    }

    if (value === ClassificationType.Normal) {
        return (
            <div className="inline-flex px-3 py-2 font-bold leading-none bg-gray-200 rounded shadow-sm">
                {ClassificationType[value]}
            </div>
        );
    }

    if (value === ClassificationType.Medium) {
        return (
            <div className="inline-flex px-3 py-2 font-bold leading-none bg-green-400 rounded shadow-sm">
                {ClassificationType[value]}
            </div>
        );
    }

    if (value === ClassificationType.Fast) {
        return (
            <div className="inline-flex px-3 py-2 font-bold leading-none bg-yellow-400 rounded shadow-sm">
                {ClassificationType[value]}
            </div>
        );
    }

    return (
        <div className="inline-flex px-3 py-2 font-bold leading-none rounded bg-purple-500 text-white shadow-sm">
            {ClassificationType[value]}
        </div>
    );
}

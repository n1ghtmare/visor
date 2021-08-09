import Tooltip from "@tippyjs/react";

export default function IdBadge({ id }: { id: string }) {
    return (
        <div className="flex items-baseline space-x-1">
            <span className="font-mono">{id.substring(0, id.indexOf("-"))}</span>
            <Tooltip content={id} className="-mb-2 font-mono">
                <span className="underline text-gray-600 cursor-help">...</span>
            </Tooltip>
        </div>
    );
}

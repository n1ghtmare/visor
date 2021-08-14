import Tooltip from "@tippyjs/react";

import IconArrowSmDown from "components/Shared/IconArrowSmDown";
import IconArrowSmUp from "components/Shared/IconArrowSmUp";

export default function PitOrderControls({
    pitOrder,
    index,
    total,
    onUpClick,
    onDownClick
}: {
    pitOrder: number;
    index: number;
    total: number;
    onUpClick: () => void;
    onDownClick: () => void;
}) {
    function handleDownClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        onDownClick();
    }

    function handleUpClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        onUpClick();
    }

    const isReOrdered = pitOrder % 1.0 === 0;

    return (
        <div className="flex items-center justify-center space-x-1">
            <span className="font-mono">{isReOrdered ? "~" : Math.floor(pitOrder)}</span>

            <div className="flex flex-1 space-x-1">
                {index !== total - 1 && (
                    <Tooltip content="Move Kart down in the pit">
                        <button
                            className={`p-1 ${
                                isReOrdered
                                    ? "text-gray-500 cursor-not-allowed"
                                    : "text-blue-600 hover:text-blue-900"
                            }`}
                            onClick={handleDownClick}
                            disabled={isReOrdered}
                        >
                            <IconArrowSmDown />
                        </button>
                    </Tooltip>
                )}

                {index !== 0 && (
                    <Tooltip content="Move Kart up in the pit">
                        <button
                            className={`p-1 ${
                                isReOrdered
                                    ? "text-gray-500 cursor-not-allowed"
                                    : "text-blue-600 hover:text-blue-900"
                            }`}
                            onClick={handleUpClick}
                            disabled={isReOrdered}
                        >
                            <IconArrowSmUp />
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

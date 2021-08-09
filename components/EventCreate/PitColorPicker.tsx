import React, { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { useDebounce } from "hooks/UtilityHooks";

import IconXCircle from "components/Shared/IconXCircle";

export default function PitColorPicker({
    name,
    colorHex,
    onChange
}: {
    name: string;
    colorHex: string;
    onChange: (newColor: string) => void;
}) {
    const popoverRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentColorHex, setCurrentColorHex] = useState<string>(colorHex);

    const debouncedColorHex = useDebounce(currentColorHex, 500);

    useEffect(() => {
        if (colorHex !== debouncedColorHex) {
            onChange(debouncedColorHex);
        }
    }, [colorHex, debouncedColorHex, onChange]);

    function handleCloseClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setIsOpen(false);
    }

    function handleHexColorPickerChange(newColor: string) {
        setCurrentColorHex(newColor);
    }

    return (
        <div
            className={`border border-gray-300 rounded ${
                isOpen ? "border-blue-600 ring-2 ring-blue-600 ring-opacity-50" : ""
            }`}
        >
            <style global jsx>{`
                .responsive .react-colorful {
                    width: auto !important;
                    height: 150px;
                    border-radius: 0;
                    border: none;
                }
                .responsive .react-colorful__saturation,
                .responsive .react-colorful__last-control {
                    border-radius: 0;
                    border: none;
                }
            `}</style>

            <div className={`flex items-center px-4 py-1 ${isOpen ? "rounded-t" : "rounded"}`}>
                <span className="flex-1 font-medium">{name}</span>
                <div
                    className="border border-gray-300 rounded cursor-pointer w-7 h-7"
                    style={{ backgroundColor: currentColorHex }}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {isOpen && (
                <>
                    <div className="responsive" ref={popoverRef}>
                        <HexColorPicker
                            color={currentColorHex}
                            onChange={handleHexColorPickerChange}
                        />
                    </div>
                    <div className="text-center">
                        <a
                            href="#"
                            onClick={handleCloseClick}
                            className="inline-flex items-center py-1 text-blue-500 space-x-1"
                        >
                            <IconXCircle />
                            <span>Close</span>
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}

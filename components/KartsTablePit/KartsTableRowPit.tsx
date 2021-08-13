import React, { useState } from "react";

import Tooltip from "@tippyjs/react";

import Kart from "entities/Kart";
import Pit from "entities/Pit";

import ClassificationBadge from "components/Shared/ClassificationBadge";
import IconPencilAlt from "components/Shared/IconPencilAlt";
import IconSwitchHorizontal from "components/Shared/IconSwitchHorizontal";
import PreviousEventNoBadge from "components/Shared/PreviousEventNoBadge";
import IdBadge from "components/Shared/IdBadge";

import EditModalPit from "./KartsTableRowPit/EditModalPit";
import MoveModalPit from "./KartsTableRowPit/MoveModalPit";
import IconArrowSmDown from "components/Shared/IconArrowSmDown";
import IconArrowSmUp from "components/Shared/IconArrowSmUp";

function PitOrderBadge({
    pitOrder,
    index,
    total
}: {
    pitOrder: number;
    index: number;
    total: number;
}) {
    function handleDownClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        console.log("will move kart down");
    }

    function handleUpClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        console.log("will move kart down");
    }

    return (
        <div className="flex items-center justify-center">
            <span>{pitOrder}</span>

            <div className="flex flex-1">
                {index !== total - 1 && (
                    <Tooltip content="Move Kart down in the pit">
                        <button
                            className="p-1 text-blue-600 hover:text-blue-900"
                            onClick={handleDownClick}
                        >
                            <IconArrowSmDown />
                        </button>
                    </Tooltip>
                )}

                {index !== 0 && (
                    <Tooltip content="Move Kart up in the pit">
                        <button
                            className="p-2 text-blue-600 hover:text-blue-900"
                            onClick={handleUpClick}
                        >
                            <IconArrowSmUp />
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

export default function KartsTableRowPit({
    kart,
    pits,
    onEditConfirm,
    eventNosInUse,
    rowIndex,
    totalRowsCount
}: {
    kart: Kart;
    pits: Pit[];
    onEditConfirm: (kart: Kart) => void;
    eventNosInUse: number[];
    rowIndex: number;
    totalRowsCount: number;
}) {
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    function handleMoveClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsMoving(true);
    }

    function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsEditing(true);
    }

    function handleModalCancelClick() {
        setIsMoving(false);
        setIsEditing(false);
    }

    function handleSubmit(kart: Kart) {
        onEditConfirm(kart);
        setIsMoving(false);
        setIsEditing(false);
    }

    console.log({ rowIndex }, { totalRowsCount });

    return (
        <>
            {isMoving && (
                <MoveModalPit
                    kart={kart}
                    pits={pits}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                    eventNosInUse={eventNosInUse}
                />
            )}

            {isEditing && (
                <EditModalPit
                    kart={kart}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                />
            )}
            <tr className="hover:bg-blue-50 hover:cursor-pointer">
                <td className="px-6 py-3 font-medium text-left">
                    <IdBadge id={kart.id} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <PreviousEventNoBadge value={kart.previousEventNo} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <ClassificationBadge value={kart.classificationType} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <PitOrderBadge
                        pitOrder={kart.pitOrder}
                        index={rowIndex}
                        total={totalRowsCount}
                    />
                </td>
                <td className="px-6 py-4 text-left">{kart.markdownNotes || "-"}</td>
                <td className="font-medium text-right whitespace-nowrap">
                    <Tooltip content="Edit kart metadata" className="-mb-4">
                        <button
                            className="p-5 text-blue-600 hover:text-blue-900"
                            onClick={handleEditClick}
                        >
                            <IconPencilAlt />
                        </button>
                    </Tooltip>
                </td>
                <td className="font-medium text-right whitespace-nowrap">
                    <Tooltip content="Move kart / change status" className="-mb-4">
                        <button
                            className="p-5 text-blue-600 hover:text-blue-900"
                            onClick={handleMoveClick}
                        >
                            <IconSwitchHorizontal />
                        </button>
                    </Tooltip>
                </td>
            </tr>
        </>
    );
}

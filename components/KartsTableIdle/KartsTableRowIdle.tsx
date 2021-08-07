import React, { useState } from "react";

import Tooltip from "@tippyjs/react";

import Kart from "entities/Kart";
import Pit from "entities/Pit";

import ClassificationBadge from "components/Shared/ClassificationBadge";
import IconPencilAlt from "components/Shared/IconPencilAlt";
import IconSwitchHorizontal from "components/Shared/IconSwitchHorizontal";
import PreviousEventNoBadge from "components/Shared/PreviousEventNoBadge";

import EditModalIdle from "./KartsTableRowIdle/EditModalIdle";
import MoveModalIdle from "./KartsTableRowIdle/MoveModalIdle";

export default function KartsTableRowIdle({
    kart,
    pits,
    eventNosInUse,
    onEditConfirm
}: {
    kart: Kart;
    pits: Pit[];
    eventNosInUse: number[];
    onEditConfirm: (kart: Kart) => void;
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

    return (
        <>
            {isMoving && (
                <MoveModalIdle
                    kart={kart}
                    pits={pits}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                    eventNosInUse={eventNosInUse}
                />
            )}

            {isEditing && (
                <EditModalIdle
                    kart={kart}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                />
            )}

            <tr className="hover:bg-blue-50 hover:cursor-pointer">
                <td className="px-6 py-3 font-medium text-left">{kart.id}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <PreviousEventNoBadge value={kart.previousEventNo} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <ClassificationBadge value={kart.classificationType} />
                </td>
                <td className="px-6 py-4 text-left">{kart.markdownNotes || "-"}</td>
                <td className="font-medium text-center whitespace-nowrap">
                    <Tooltip content="Edit kart metadata" className="-mb-4">
                        <button
                            className="p-5 text-blue-600 hover:text-blue-900"
                            onClick={handleEditClick}
                        >
                            <IconPencilAlt />
                        </button>
                    </Tooltip>
                </td>
                <td className="font-medium text-center whitespace-nowrap">
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

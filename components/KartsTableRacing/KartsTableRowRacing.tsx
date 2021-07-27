import React, { useState } from "react";

import Tooltip from "@tippyjs/react";

import Kart from "entities/Kart";

import ClassificationBadge from "components/Shared/ClassificationBadge";
import EventNoBadge from "components/Shared/EventNoBadge";
import IconPencilAlt from "components/Shared/IconPencilAlt";
import IconSwitchHorizontal from "components/Shared/IconSwitchHorizontal";
import PreviousEventNoBadge from "components/Shared/PreviousEventNoBadge";

import EditModalRacing from "./KartsTableRowRacing/EditModalRacing";
import MoveModalRacing from "./KartsTableRowRacing/MoveModalRacing";

export default function KartsTableRowRacing({
    kart,
    onEditConfirm
}: {
    kart: Kart;
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
                <MoveModalRacing
                    key="move-modal-racing"
                    kart={kart}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                />
            )}

            {isEditing && (
                <EditModalRacing
                    key="edit-modal-racing"
                    kart={kart}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                />
            )}

            <tr className="hover:bg-blue-50 hover:cursor-pointer">
                <td className="px-6 py-3 font-medium text-left">{kart.id}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <EventNoBadge value={kart.eventNo} />
                </td>
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
                            title="Edit"
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
                            title="Move"
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

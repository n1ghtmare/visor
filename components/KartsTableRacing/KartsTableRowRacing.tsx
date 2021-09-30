import React, { useState } from "react";

import Tooltip from "@tippyjs/react";

import Kart from "entities/Kart";
import Pit from "entities/Pit";

import ClassificationBadge from "components/Shared/ClassificationBadge";
import EventNoBadge from "components/Shared/EventNoBadge";
import IdBadge from "components/Shared/IdBadge";
import PreviousEventNoBadge from "components/Shared/PreviousEventNoBadge";
import IconPencilAlt from "components/Shared/IconPencilAlt";
import IconSwitchHorizontal from "components/Shared/IconSwitchHorizontal";
import MarkdownDisplay from "components/Shared/MarkdownDisplay";
import EditKartModal from "components/Shared/EditKartModal";
import IconTrash from "components/Shared/IconTrash";
import DeleteKartModal from "components/Shared/DeleteKartModal";

import MoveKartModalRacing from "./KartsTableRowRacing/MoveKartModalRacing";

export default function KartsTableRowRacing({
    kart,
    pits,
    onEditConfirm,
    onDeleteConfirm
}: {
    kart: Kart;
    pits: Pit[];
    onEditConfirm: (kart: Kart) => void;
    onDeleteConfirm: (kart: Kart) => void;
}) {
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    function handleMoveClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsMoving(true);
    }

    function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsEditing(true);
    }

    function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsDeleting(true);
    }

    function handleModalCancelClick() {
        closeAllModals();
    }

    function handleSubmit(kart: Kart) {
        onEditConfirm(kart);
        closeAllModals();
    }

    function handleDelete() {
        onDeleteConfirm(kart);
        closeAllModals();
    }

    function closeAllModals() {
        setIsMoving(false);
        setIsEditing(false);
        setIsDeleting(false);
    }

    return (
        <>
            {isMoving && (
                <MoveKartModalRacing
                    key="move-modal-racing"
                    pits={pits}
                    kart={kart}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                />
            )}

            {isEditing && (
                <EditKartModal
                    key="edit-modal-racing"
                    kart={kart}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                />
            )}

            {isDeleting && (
                <DeleteKartModal
                    key="delete-modal-racing"
                    kart={kart}
                    onSubmit={handleDelete}
                    onCancel={handleModalCancelClick}
                />
            )}

            <tr className="hover:bg-blue-50 hover:cursor-pointer">
                <td className="px-6 py-3 font-medium text-left">
                    <IdBadge id={kart.id} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <EventNoBadge value={kart.eventNo} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <PreviousEventNoBadge value={kart.previousEventNo} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                    <ClassificationBadge value={kart.classificationType} />
                </td>
                <td className="px-6 py-4 text-left">
                    {kart.markdownNotes ? <MarkdownDisplay content={kart.markdownNotes} /> : "-"}
                </td>
                <td className="font-medium text-center whitespace-nowrap">
                    <Tooltip content="Delete kart" className="-mb-4">
                        <button
                            className="p-5 text-red-600 hover:text-red-900"
                            onClick={handleDeleteClick}
                        >
                            <IconTrash />
                        </button>
                    </Tooltip>
                </td>
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

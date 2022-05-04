import React, { useState } from "react";

import Tooltip from "@tippyjs/react";

import { Kart, Pit } from "@prisma/client";

import ClassificationBadge from "components/Shared/ClassificationBadge";
import IconPencilAlt from "components/Shared/IconPencilAlt";
import IconSwitchHorizontal from "components/Shared/IconSwitchHorizontal";
import PreviousEventNoBadge from "components/Shared/PreviousEventNoBadge";
import IdBadge from "components/Shared/IdBadge";
import MarkdownDisplay from "components/Shared/MarkdownDisplay";
import EditKartModal from "components/Shared/EditKartModal";

import MoveKartModalIdle from "./KartsTableRowIdle/MoveKartModalIdle";
import DeleteKartModal from "components/Shared/DeleteKartModal";
import IconTrash from "components/Shared/IconTrash";

export default function KartsTableRowIdle({
    kart,
    pits,
    eventNosInUse,
    onEditConfirm,
    onDeleteConfirm
}: {
    kart: Kart;
    pits: Pit[];
    eventNosInUse: number[];
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
        setIsMoving(false);
        setIsEditing(false);
    }

    function handleSubmit(kart: Kart) {
        onEditConfirm(kart);
        setIsMoving(false);
        setIsEditing(false);
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
                <MoveKartModalIdle
                    key="move-modal-idle"
                    kart={kart}
                    pits={pits}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                    eventNosInUse={eventNosInUse}
                />
            )}

            {isEditing && (
                <EditKartModal
                    key="edit-modal-idle"
                    kart={kart}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancelClick}
                />
            )}

            {isDeleting && (
                <DeleteKartModal
                    key="delete-modal-idle"
                    kart={kart}
                    onSubmit={handleDelete}
                    onCancel={handleModalCancelClick}
                />
            )}

            <tr className="hover:cursor-pointer hover:bg-blue-50">
                <td className="px-6 py-3 text-left font-medium">
                    <IdBadge id={kart.id} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                    <PreviousEventNoBadge value={kart.previousEventNo} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                    <ClassificationBadge value={kart.classificationType} />
                </td>
                <td className="px-6 py-4 text-left">
                    {kart.markdownNotes ? <MarkdownDisplay content={kart.markdownNotes} /> : "-"}
                </td>
                <td className="whitespace-nowrap text-center font-medium">
                    <Tooltip content="Delete kart" className="-mb-4">
                        <button
                            className="p-5 text-red-600 hover:text-red-900"
                            onClick={handleDeleteClick}
                        >
                            <IconTrash />
                        </button>
                    </Tooltip>
                </td>
                <td className="whitespace-nowrap text-center font-medium">
                    <Tooltip content="Edit kart metadata" className="-mb-4">
                        <button
                            className="p-5 text-blue-600 hover:text-blue-900"
                            onClick={handleEditClick}
                        >
                            <IconPencilAlt />
                        </button>
                    </Tooltip>
                </td>
                <td className="whitespace-nowrap text-center font-medium">
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

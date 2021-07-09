import { useState } from "react";

import { generateTimestampText } from "helpers/timestamp";

import EventComposite from "entities/EventComposite";

import IconTrash from "components/Shared/IconTrash";
import DeleteModal from "./EventsTableRow/DeleteModal";

export default function EventsTableRow(props: {
    event: EventComposite;
    onDeleteConfirm: (id: number) => void;
}) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const { event } = props;

    function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsDeleting(true);
    }

    function handleDeleteModalSubmit() {
        props.onDeleteConfirm(event.id);
    }

    function handleDeleteModalCancelClick() {
        setIsDeleting(false);
    }

    return (
        <>
            {isDeleting && (
                <DeleteModal
                    eventName={event.name}
                    onSubmit={handleDeleteModalSubmit}
                    onCancel={handleDeleteModalCancelClick}
                />
            )}

            <tr className="hover:bg-blue-50 hover:cursor-pointer">
                <td className="px-6 py-3 font-medium text-left">
                    <a href="#" className="text-blue-600 hover:text-blue-900">
                        {event.name}
                    </a>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">{event.noOfKartsTotal}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">{event.noOfKartsInRace}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">{event.noOfKartsInBox}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">{event.noOfKartsIdle}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">{event.noOfBoxes}</td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {generateTimestampText(event.createdOnDate)}
                </td>
                <td className="px-6 py-4 font-medium text-right whitespace-nowrap">
                    <button className="text-red-600 hover:text-red-900" onClick={handleDeleteClick}>
                        <IconTrash />
                    </button>
                </td>
            </tr>
        </>
    );
}

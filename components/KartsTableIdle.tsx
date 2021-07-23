import React, { useEffect, useRef, useState } from "react";

import ClassificationType from "entities/ClassificationType";
import Kart from "entities/Kart";
import IconPencilAlt from "./Shared/IconPencilAlt";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";
import StatusType from "entities/StatusType";
import { usePits } from "hooks/PitHooks";
import { useEscCancel, useOutsideRefsClick } from "hooks/UtilityHooks";
import Modal from "./Modal";
import Button from "./Shared/Button";
import ButtonOutline from "./Shared/ButtonOutline";
import IconBan from "./Shared/IconBan";
import IconPlay from "./Shared/IconPlay";
import IconStop from "./Shared/IconStop";
import LoadingIndicatorFlat from "./Shared/LoadingIndicatorFlat";
import Radio from "./Shared/Radio";
import TextArea from "./Shared/TextArea";
import IconSwitchHorizontal from "./Shared/IconSwitchHorizontal";
import IconFlag from "./Shared/IconFlag";
import Input from "./Shared/Input";
import ClassificationBadge from "./Shared/ClassificationBadge";
import PreviousEventNoBadge from "./Shared/PreviousEventNoBadge";

function EditModalIdle({
    kart,
    onCancel,
    onSubmit
}: {
    kart: Kart;
    onCancel: () => void;
    onSubmit: (kart: Kart) => void;
}) {
    // TODO: See what kind of validation rules these inputs need?
    const [markdownNotes, setMarkdownNotes] = useState<string>("");
    const [classificationType, setClassificationType] = useState<ClassificationType>(
        kart.classificationType
    );

    const modalRef = useRef<HTMLDivElement>(null);

    useEscCancel(onCancel);
    useOutsideRefsClick([modalRef], onCancel);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit({ ...kart, classificationType, markdownNotes });
    }

    function handleCancelClick() {
        onCancel();
    }

    function handleClassificationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setClassificationType(parseInt(e.target.value, 10));
    }

    function handleMarkdownNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setMarkdownNotes(e.target.value);
    }

    return (
        <Modal title="Edit Kart" ref={modalRef}>
            <form onSubmit={handleSubmit}>
                <div className="mt-6">
                    <p>
                        You are editing kart <strong>{kart.id}</strong>.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="mt-6 space-y-4">
                        <div className="flex px-4 py-2 border rounded">
                            <Radio
                                value={ClassificationType.SlowAF.toString()}
                                name="classificationType"
                                labelText="Slow AF"
                                checked={classificationType === ClassificationType.SlowAF}
                                onChange={handleClassificationChange}
                            />
                            <div className="w-6 min-h-full bg-red-200 rounded" />
                        </div>
                        <div className="flex px-4 py-2 border rounded">
                            <Radio
                                value={ClassificationType.Normal.toString()}
                                name="classificationType"
                                labelText="Normal"
                                checked={classificationType === ClassificationType.Normal}
                                onChange={handleClassificationChange}
                            />
                            <div className="w-6 min-h-full bg-gray-200 rounded" />
                        </div>
                        <div className="flex px-4 py-2 border rounded">
                            <Radio
                                value={ClassificationType.Medium.toString()}
                                name="classificationType"
                                labelText="Medium"
                                checked={classificationType === ClassificationType.Medium}
                                onChange={handleClassificationChange}
                            />
                            <div className="w-6 min-h-full bg-green-400 rounded" />
                        </div>
                        <div className="flex px-4 py-2 border rounded">
                            <Radio
                                value={ClassificationType.Fast.toString()}
                                name="classificationType"
                                labelText="Fast"
                                checked={classificationType === ClassificationType.Fast}
                                onChange={handleClassificationChange}
                            />
                            <div className="w-6 min-h-full bg-yellow-400 rounded" />
                        </div>
                        <div className="flex px-4 py-2 border rounded">
                            <Radio
                                value={ClassificationType.Epic.toString()}
                                name="classificationType"
                                labelText="Epic"
                                checked={classificationType === ClassificationType.Epic}
                                onChange={handleClassificationChange}
                            />
                            <div className="w-6 min-h-full bg-purple-500 rounded" />
                        </div>
                    </div>

                    {/* TODO: Move this to "In Pit" and "Idle" you shouldn't be able to assign a race no while in game? (also it should be in the other modal, when changing statuses)
                    <div className="space-y-2">
                        <label className="font-bold" htmlFor="raceNo">
                            Race No.
                        </label>
                        <Input id="raceNo" type="text" placeholder="Unique Race No..." />
                    </div>
                      */}

                    <div className="space-y-2">
                        <label className="font-bold" htmlFor="markdownNotes">
                            Notes
                        </label>
                        <TextArea
                            id="markdownNotes"
                            name="markdownNotes"
                            placeholder="Notes in markdown..."
                            onChange={handleMarkdownNotesChange}
                            value={markdownNotes}
                        />
                    </div>
                </div>
                <div className="mt-6 sm:flex sm:flex-row-reverse sm:space-x-2 sm:space-x-reverse">
                    <span className="flex w-full sm:w-auto">
                        <Button type="submit">
                            <IconPlay />
                            <span>Continue</span>
                        </Button>
                    </span>
                    <span className="flex w-full mt-4 sm:mt-0 sm:w-auto">
                        <ButtonOutline type="reset" onClick={handleCancelClick}>
                            <IconBan />
                            <span>Cancel</span>
                        </ButtonOutline>
                    </span>
                </div>
            </form>
        </Modal>
    );
}

function MoveModalIdle({
    kart,
    onCancel,
    onSubmit,
    eventNosInUse
}: {
    kart: Kart;
    onCancel: () => void;
    onSubmit: (kart: Kart) => void;
    eventNosInUse: number[];
}) {
    // TODO: Refactor this into a reducer (too much state here)
    const [statusType, setStatusType] = useState<StatusType>(null);
    const [pitId, setPitId] = useState<string>(null);
    const [validationErrorForStatus, setValidationErrorForStatus] = useState<string>(null);
    const [validationErrorForEventNo, setValidationErrorForEventNo] = useState<string>(null);
    const [eventNo, setEventNo] = useState<string>("");

    const modalRef = useRef<HTMLDivElement>(null);

    const { pits, isLoading, isError } = usePits(kart.eventId);

    useEscCancel(onCancel);
    useOutsideRefsClick([modalRef], onCancel);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!statusType) {
            setValidationErrorForStatus("Invalid status type.");
            return;
        }

        if (statusType === StatusType.Racing && eventNo.length === 0) {
            setValidationErrorForEventNo("Event No is required");
            return;
        }

        if (statusType === StatusType.Pit) {
            onSubmit({ ...kart, statusType, pitId });

            return;
        }

        // Decide on new kart no?
        onSubmit({
            ...kart,
            statusType: StatusType.Racing,
            eventNo: parseInt(eventNo, 10),
            pitId: null
        });
    }

    function handleCancelClick() {
        onCancel();
    }

    function handleEventNoChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValidationErrorForEventNo(null);
        const newEventNo = parseInt(e.target.value, 10);

        if (isNaN(newEventNo)) {
            setValidationErrorForEventNo("Has to be a number.");
        }

        if (eventNosInUse.includes(newEventNo)) {
            setValidationErrorForEventNo(`${newEventNo} is already in use.`);
        }

        setEventNo(e.target.value);
    }

    function parseStatus(value: string): StatusType {
        if (!value) {
            return null;
        }

        if (value.indexOf("pit|") === 0) {
            return StatusType.Pit;
        }

        return StatusType.Racing;
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newStatusType: StatusType = parseStatus(e.target.value);
        const newPitId: string =
            newStatusType === StatusType.Pit ? e.target.value.split("|")[1] : null;

        setStatusType(newStatusType);
        setPitId(newPitId);

        // Reset the validation errors and event no
        setValidationErrorForStatus(null);
        setValidationErrorForEventNo(null);
        setEventNo("");
    }

    if (isError) {
        return (
            <Modal title="Error" ref={modalRef}>
                <div className="text-center">Failed to load data...</div>
            </Modal>
        );
    }

    if (isLoading) {
        return (
            <Modal ref={modalRef}>
                <LoadingIndicatorFlat />
            </Modal>
        );
    }

    return (
        <Modal title="Move Kart (change status)" ref={modalRef}>
            <form onSubmit={handleSubmit}>
                <div className="mt-6">
                    <p>
                        You are moving kart <strong>{kart.id}</strong>.
                    </p>
                </div>
                <div className="mt-6 space-y-6">
                    {validationErrorForStatus && (
                        <div className="text-red-500">* {validationErrorForStatus}</div>
                    )}

                    <div className="space-y-4">
                        {pits.map((x) => (
                            <div key={x.id} className="flex px-4 py-2 border rounded">
                                <Radio
                                    name="status"
                                    value={`pit|${x.id}`}
                                    labelText={x.name}
                                    onChange={handleStatusChange}
                                />
                                <div
                                    style={{ backgroundColor: `${x.colorHex}` }}
                                    className="w-6 min-h-full rounded"
                                />
                            </div>
                        ))}
                        <div className="flex px-4 py-2 border rounded">
                            <Radio
                                name="status"
                                value="racing"
                                labelText="Racing"
                                onChange={handleStatusChange}
                            />
                            <div>
                                <IconFlag />
                            </div>
                        </div>
                    </div>

                    {statusType === StatusType.Racing && (
                        <div className="space-y-2">
                            <div className="flex items-baseline">
                                <label className="flex-1 font-bold" htmlFor="eventNo">
                                    Event No.
                                </label>

                                {validationErrorForEventNo && (
                                    <span className="text-sm text-red-500">
                                        {validationErrorForEventNo}
                                    </span>
                                )}
                            </div>
                            <Input
                                id="eventNo"
                                type="text"
                                placeholder="Unique Event No..."
                                value={eventNo}
                                isInvalid={!!validationErrorForEventNo}
                                onChange={handleEventNoChange}
                            />
                        </div>
                    )}
                </div>
                <div className="mt-6 sm:flex sm:flex-row-reverse sm:space-x-2 sm:space-x-reverse">
                    <span className="flex w-full sm:w-auto">
                        <Button type="submit">
                            <IconPlay />
                            <span>Continue</span>
                        </Button>
                    </span>
                    <span className="flex w-full mt-4 sm:mt-0 sm:w-auto">
                        <ButtonOutline type="reset" onClick={handleCancelClick}>
                            <IconBan />
                            <span>Cancel</span>
                        </ButtonOutline>
                    </span>
                </div>
            </form>
        </Modal>
    );
}

function KartsTableRowIdle({
    kart,
    eventNosInUse,
    onEditConfirm
}: {
    kart: Kart;
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
                <td className="px-6 py-4 text-left whitespace-nowrap">
                    {kart.markdownNotes || "-"}
                </td>
                <td className="font-medium text-center whitespace-nowrap">
                    <button
                        className="p-5 text-blue-600 hover:text-blue-900"
                        title="Edit"
                        onClick={handleEditClick}
                    >
                        <IconPencilAlt />
                    </button>
                </td>
                <td className="font-medium text-center whitespace-nowrap">
                    <button
                        className="p-5 text-blue-600 hover:text-blue-900"
                        title="Move"
                        onClick={handleMoveClick}
                    >
                        <IconSwitchHorizontal />
                    </button>
                </td>
            </tr>
        </>
    );
}

function KartsTableHeaderIdle() {
    return (
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase w-96">
                    Id
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase w-44 whitespace-nowrap">
                    Previous Event No
                </th>
                <th className="w-40 px-6 py-4 text-xs font-medium tracking-wider text-left text-center text-gray-500 uppercase whitespace-nowrap">
                    Classification
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Notes
                </th>
                <th className="w-20">
                    <span className="sr-only">Edit</span>
                </th>
                <th className="w-20">
                    <span className="sr-only">Change Status</span>
                </th>
            </tr>
        </thead>
    );
}

export default function KartsTableIdle({
    karts,
    eventNosInUse,
    onEditConfirm
}: {
    karts: Kart[];
    eventNosInUse: number[];
    onEditConfirm: (kart: Kart) => void;
}) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderIdle />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={6}
                        message={
                            "No karts are idle right now. When you move a kart from either the race or the pit into idle, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => (
                        <KartsTableRowIdle
                            key={x.id}
                            kart={x}
                            eventNosInUse={eventNosInUse}
                            onEditConfirm={onEditConfirm}
                        />
                    ))
                )}
            </KartsTableBody>
        </KartsTable>
    );
}

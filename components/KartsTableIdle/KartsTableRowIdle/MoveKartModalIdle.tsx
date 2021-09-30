import React, { useState, useRef } from "react";

import { useEscCancel, useOutsideRefsClick } from "hooks/UtilityHooks";

import Kart from "entities/Kart";
import Pit from "entities/Pit";
import StatusType from "entities/StatusType";

import AvailableEventNosNotice from "components/Shared/AvailableEventNosNotice";
import Button from "components/Shared/Button";
import ButtonOutline from "components/Shared/ButtonOutline";
import IconBan from "components/Shared/IconBan";
import IconFlag from "components/Shared/IconFlag";
import IconPlay from "components/Shared/IconPlay";
import Input from "components/Shared/Input";
import Modal from "components/Shared/Modal";
import Radio from "components/Shared/Radio";

export default function MoveKartModalIdle({
    kart,
    pits,
    onCancel,
    onSubmit,
    eventNosInUse
}: {
    kart: Kart;
    pits: Pit[];
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

        if (newEventNo <= 0) {
            setValidationErrorForEventNo("Has to greater than 0.");
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
                        <>
                            <AvailableEventNosNotice eventNosInUse={eventNosInUse} />
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
                        </>
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

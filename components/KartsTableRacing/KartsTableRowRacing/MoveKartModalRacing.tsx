import React, { useState, useRef, useEffect } from "react";

import { useEscCancel, useOutsideRefsClick } from "hooks/UtilityHooks";

import StatusType from "entities/StatusType";

import Button from "components/Shared/Button";
import ButtonOutline from "components/Shared/ButtonOutline";
import IconBan from "components/Shared/IconBan";
import IconPlay from "components/Shared/IconPlay";
import IconStop from "components/Shared/IconStop";
import Modal from "components/Shared/Modal";
import Radio from "components/Shared/Radio";
import { Kart, Pit } from "@prisma/client";

export default function MoveKartModalRacing({
    kart,
    pits,
    onCancel,
    onSubmit
}: {
    kart: Kart;
    pits: Pit[];
    onCancel: () => void;
    onSubmit: (kart: Kart) => void;
}) {
    const [statusType, setStatusType] = useState<StatusType>(null);
    const [pitId, setPitId] = useState<string>(null);
    const [isValidationError, setIsValidationError] = useState<boolean>(false);

    const modalRef = useRef<HTMLDivElement>(null);

    useEscCancel(onCancel);
    useOutsideRefsClick([modalRef], onCancel);

    useEffect(() => {
        setIsValidationError(false);
    }, [statusType]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!statusType) {
            setIsValidationError(true);

            return;
        }

        if (statusType === StatusType.Pit) {
            onSubmit({
                ...kart,
                statusType,
                pitId,
                previousEventNo: kart.eventNo,
                eventNo: null
            });

            return;
        }

        onSubmit({
            ...kart,
            statusType: StatusType.Idle,
            pitId: null,
            previousEventNo: kart.eventNo,
            eventNo: null
        });
    }

    function handleCancelClick() {
        onCancel();
    }

    function parseStatus(value: string): StatusType {
        if (!value) {
            return null;
        }

        if (value.indexOf("pit|") === 0) {
            return StatusType.Pit;
        }

        return StatusType.Idle;
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newStatusType: StatusType = parseStatus(e.target.value);
        const newPitId: string =
            newStatusType === StatusType.Pit ? e.target.value.split("|")[1] : null;

        setStatusType(newStatusType);
        setPitId(newPitId);
    }

    return (
        <Modal title="Move Kart (change status)" ref={modalRef}>
            <form onSubmit={handleSubmit}>
                <div className="mt-6">
                    <p>
                        You are moving kart <strong>{kart.id}</strong>.
                    </p>
                </div>
                {isValidationError && (
                    <div className="text-red-500">
                        * You need to select a valid status in order to continue.
                    </div>
                )}
                <div className="mt-6 space-y-4">
                    {pits.map((x) => (
                        <div key={x.id} className="flex rounded border px-4 py-2">
                            <Radio
                                name="status"
                                value={`pit|${x.id}`}
                                labelText={x.name}
                                onChange={handleStatusChange}
                            />
                            <div
                                style={{ backgroundColor: `${x.colorHex}` }}
                                className="min-h-full w-6 rounded"
                            />
                        </div>
                    ))}
                    <div className="flex rounded border px-4 py-2">
                        <Radio
                            name="status"
                            value={StatusType.Idle.toString()}
                            labelText="Idle"
                            onChange={handleStatusChange}
                        />
                        <div>
                            <IconStop />
                        </div>
                    </div>
                </div>
                <div className="mt-6 sm:flex sm:flex-row-reverse sm:space-x-2 sm:space-x-reverse">
                    <span className="flex w-full sm:w-auto">
                        <Button type="submit">
                            <IconPlay />
                            <span>Continue</span>
                        </Button>
                    </span>
                    <span className="mt-4 flex w-full sm:mt-0 sm:w-auto">
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

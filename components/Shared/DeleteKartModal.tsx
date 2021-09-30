import React, { useRef } from "react";

import { useEscCancel, useOutsideRefsClick } from "hooks/UtilityHooks";

import Kart from "entities/Kart";

import ButtonDanger from "components/Shared/ButtonDanger";
import ButtonOutline from "components/Shared/ButtonOutline";
import IconBan from "components/Shared/IconBan";
import IconExclamationCircle from "components/Shared/IconExclamationCircle";
import Modal from "components/Shared/Modal";

export default function DeleteKartModal(props: {
    kart: Kart;
    onCancel: () => void;
    onSubmit: () => void;
}) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close the modal when the user either hits Esc or clicks outside
    useEscCancel(props.onCancel);
    useOutsideRefsClick([modalRef], props.onCancel);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        props.onSubmit();
    }

    function handleCancelClick() {
        props.onCancel();
    }

    return (
        <Modal title="Deleting kart" ref={modalRef}>
            <form onSubmit={handleSubmit}>
                <div className="py-6">
                    <p>
                        <strong>Warning:</strong> This will permanently delete the kart{" "}
                        <strong>{props.kart.id}</strong> from the event. This act cannot be undone!
                    </p>
                    <p className="mt-6">Are you sure you want to continue?</p>
                </div>
                <div className="mt-3 sm:flex sm:flex-row-reverse sm:space-x-2 sm:space-x-reverse">
                    <span className="flex w-full sm:w-auto">
                        <ButtonDanger type="submit">
                            <IconExclamationCircle />
                            <span>Yes, I&apos;m sure!</span>
                        </ButtonDanger>
                    </span>
                    <span className="flex w-full mt-3 sm:mt-0 sm:w-auto">
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

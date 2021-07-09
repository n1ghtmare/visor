import { useCallback, useEffect, useRef } from "react";

import Modal from "components/Modal";
import ButtonDanger from "components/Shared/ButtonDanger";
import ButtonOutline from "components/Shared/ButtonOutline";
import IconBan from "components/Shared/IconBan";
import IconExclamationCircle from "components/Shared/IconExclamationCircle";

function useEscCancel(handler: () => void) {
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handler();
            }
        };
        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [handler]);
}

// Detect a click that is outside of the refs passed to the hook and execute the callback (used for dropdowns and modals)
export function useOutsideRefsClick(
    refs: React.MutableRefObject<HTMLElement>[],
    handler: () => void
) {
    useEffect(() => {
        function listener(e: Event) {
            const filteredRefs = refs.filter(
                (x) => !x.current || x.current.contains(e.target as Node)
            );

            if (filteredRefs.length === 0) {
                handler();
            }
        }

        console.log({ refs });

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [refs, handler]);
}

export default function DeleteModal(props: {
    eventName: string;
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
        <Modal title="Deleting event" ref={modalRef}>
            <form onSubmit={handleSubmit}>
                <div className="py-6">
                    <p>
                        <strong>Warning:</strong> This will permanently delete the event{" "}
                        <strong>{props.eventName}</strong>. This act cannot be undone!
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

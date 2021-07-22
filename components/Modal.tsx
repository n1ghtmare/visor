import { forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef<HTMLDivElement, React.PropsWithChildren<{ title?: string }>>(
    (props, ref) => {
        const [isInitialized, setIsInitialized] = useState(false);

        useEffect(() => {
            const scrollbarWidth: number = window.innerWidth - document.body.offsetWidth;

            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            setIsInitialized(true);

            return () => {
                document.body.style.removeProperty("overflow");
                document.body.style.removeProperty("padding-right");
            };
        }, []);

        return (
            isInitialized &&
            createPortal(
                <div className="fixed inset-x-0 bottom-0 z-10 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center animate-fade-in">
                    <div className="fixed inset-0">
                        <div className="absolute inset-0 bg-gray-700 opacity-75"></div>
                    </div>

                    <div
                        className="z-50 overflow-hidden text-gray-900 bg-white rounded shadow-md dark:bg-gray-800 sm:max-w-lg sm:w-full dark:text-gray-200"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        ref={ref}
                    >
                        <div className="px-5 py-4">
                            <h3
                                className="mt-2 text-lg font-bold tracking-tight leading-6"
                                id="modal-title"
                            >
                                {props.title}
                            </h3>
                            {props.children}
                        </div>
                    </div>
                </div>,
                document.getElementById("modal-container")
            )
        );
    }
);

Modal.displayName = "Modal";

export default Modal;

import React, { useState, useRef } from "react";

import { useEscCancel, useOutsideRefsClick } from "hooks/UtilityHooks";

import ClassificationType from "entities/ClassificationType";
import Kart from "entities/Kart";

import Button from "components/Shared/Button";
import ButtonOutline from "components/Shared/ButtonOutline";
import IconBan from "components/Shared/IconBan";
import IconPlay from "components/Shared/IconPlay";
import Radio from "components/Shared/Radio";
import TextArea from "components/Shared/TextArea";
import Modal from "components/Shared/Modal";

export default function EditModalPit({
    kart,
    onCancel,
    onSubmit
}: {
    kart: Kart;
    onCancel: () => void;
    onSubmit: (kart: Kart) => void;
}) {
    // TODO: See what kind of validation rules these inputs need?
    const [markdownNotes, setMarkdownNotes] = useState<string>(kart.markdownNotes || "");
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
                    <span className="flex w-full mt-2 sm:mt-0 sm:w-auto">
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

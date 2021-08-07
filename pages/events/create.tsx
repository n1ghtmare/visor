import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

import { useRouter } from "next/router";

import { groupedMapByStatusType } from "helpers/data";
import useUser from "hooks/UserHooks";

import PostEventResponseData from "entities/PostEventResponseData";
import EventComposite from "entities/EventComposite";
import StatusType from "entities/StatusType";
import Kart from "entities/Kart";

import Button from "components/Shared/Button";
import Input from "components/Shared/Input";
import IconPlay from "components/Shared/IconPlay";
import LoadingIndicator from "components/Shared/LoadingIndicator";
import Layout from "components/Shared/Layout";
import { useOutsideRefsClick } from "hooks/UtilityHooks";
import { HexColorPicker } from "react-colorful";
import IconXCircle from "components/Shared/IconXCircle";

type CreateFormInputs = {
    name: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfPits: number;
};

async function createEvent(data: CreateFormInputs): Promise<PostEventResponseData> {
    const response = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(response.status.toString());
    }

    const serverData = await response.json();

    return serverData as PostEventResponseData;
}

function PitColorPicker({
    name,
    colorHex: colorInHex,
    onChange
}: {
    name: string;
    colorHex: string;
    onChange: (newColor: string) => void;
}) {
    const popoverRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    function handleCloseClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setIsOpen(false);
    }

    return (
        <div
            className={`border border-gray-300 rounded ${
                isOpen ? "border-blue-600 ring-2 ring-blue-600 ring-opacity-50" : ""
            }`}
        >
            <style global jsx>{`
                .responsive .react-colorful {
                    width: auto !important;
                    height: 150px;
                    border-radius: 0;
                    border: none;
                }
                .responsive .react-colorful__saturation,
                .responsive .react-colorful__last-control {
                    border-radius: 0;
                    border: none;
                }
            `}</style>

            <div className={`flex items-center px-4 py-1 ${isOpen ? "rounded-t" : "rounded"}`}>
                <span className="flex-1 font-medium">{name}</span>
                <div
                    className="border border-gray-300 rounded cursor-pointer w-7 h-7"
                    style={{ backgroundColor: colorInHex }}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {isOpen && (
                <>
                    <div className="responsive" ref={popoverRef}>
                        <HexColorPicker color={colorInHex} onChange={onChange} />
                    </div>
                    <div className="text-center">
                        <a
                            href="#"
                            onClick={handleCloseClick}
                            className="inline-flex items-center py-1 text-blue-500 space-x-1"
                        >
                            <IconXCircle />
                            <span>Close</span>
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}

type PitColorMap = {
    name: string;
    colorHex: string;
};

const DEFAULT_PIT_COLORS_MAP = {
    0: "#00ffc2",
    1: "#00ff0a",
    2: "#0040ff",
    3: "#e300ff",
    4: "#e01b1b"
};

export default function Create() {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm<CreateFormInputs>();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user } = useUser({ redirectTo: "/login" });

    // TODO: Make this dynamic and for each color pit (also choose better defaults)
    const [pitColors, setPitColors] = useState<{ name: string; colorHex }[]>();

    async function onSubmit(data: CreateFormInputs) {
        setIsLoading(true);

        // When creating a new event push it to the cache and re-validate entries (we already have it in the response)
        await mutate("/api/events/composite", async (events: EventComposite[]) => {
            const { event, karts, pits } = await createEvent(data);
            const grouped: Map<StatusType, Kart[]> = groupedMapByStatusType(karts);

            if (!events) {
                // there are no previous events here, that means we need to refetch them
                return events;
            }

            return [
                ...events,
                {
                    ...event,
                    noOfKartsTotal: karts.length,
                    noOfKartsInRace: grouped.get(StatusType.Racing).length,
                    noOfKartsIdle: grouped.get(StatusType.Idle).length,
                    noOfKartsInPit: grouped.get(StatusType.Pit).length,
                    noOfPits: pits.length
                }
            ];
        });

        setIsLoading(false);

        router.push("/events");
    }

    if (isLoading || !user?.isLoggedIn) {
        return (
            <Layout pageTitle="Visor - Loading data..." shouldDisplayHeader={false}>
                <LoadingIndicator />
            </Layout>
        );
    }

    const noOfPitsRegister = register("noOfPits", {
        required: "Required.",
        validate: {
            isNumber: (x) => !isNaN(x) || "Has to be a number.",
            isAboveMin: (x) => x >= 1 || "Has to be at least 1.",
            isBelowMax: (x) => x <= 5 || "Too many pits, max is 5."
        }
    });

    function handleNoOfPitsChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;
        const n = parseInt(value, 10);

        if (!isNaN(n) && n >= 1 && n <= 5) {
            const newPitColors: PitColorMap[] = [];

            for (let i = 0; i < n; i++) {
                newPitColors.push({ name: `Pit ${i + 1}`, colorHex: DEFAULT_PIT_COLORS_MAP[i] });
            }

            setPitColors(newPitColors);
        } else {
            setPitColors(null);
        }
    }

    return (
        <Layout pageTitle="Visor - Create Event">
            <div className="flex flex-col items-center">
                <main role="main" className="w-2/4">
                    <h1 className="text-4xl font-bold tracking-tight">Create Event</h1>

                    <div className="translate-x-0 translate-y-0">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-16 overflow-hidden bg-white border border-gray-300 rounded-lg shadow divide-y divide-gray-200"
                        >
                            <div className="px-6 py-3">
                                <div className="mt-4">
                                    <div className="flex items-baseline">
                                        <label className="flex-1 mb-2 font-bold" htmlFor="name">
                                            What&apos;s the name of the event?
                                        </label>

                                        {errors.name && (
                                            <span className="text-sm text-red-500">
                                                {errors.name.message}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        {...register("name", {
                                            required: "Required.",
                                            minLength: 2
                                        })}
                                        id="name"
                                        type="text"
                                        isInvalid={!!errors.name}
                                        placeholder="Name of event..."
                                    />
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-baseline">
                                        <label
                                            className="flex-1 mb-2 font-bold"
                                            htmlFor="noOfTotalKarts"
                                        >
                                            How many karts in total?
                                        </label>

                                        {errors.noOfTotalKarts && (
                                            <span className="text-sm text-red-500">
                                                {errors.noOfTotalKarts.message}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        {...register("noOfTotalKarts", {
                                            required: "Required.",
                                            validate: {
                                                isNumber: (x) => !isNaN(x) || "Has to be a number.",
                                                isAboveMin: (x) =>
                                                    x >= 1 || "Has to be at least 1.",
                                                isBelowMax: (x) =>
                                                    x <= 200 || "Too many karts, max is 200."
                                            }
                                        })}
                                        id="noOfTotalKarts"
                                        type="text"
                                        isInvalid={!!errors.noOfTotalKarts}
                                        placeholder="No. of karts in total..."
                                    />
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-baseline">
                                        <label
                                            className="flex-1 mb-2 font-bold"
                                            htmlFor="noOfStartingKarts"
                                        >
                                            How many karts are starting?
                                        </label>

                                        {errors.noOfStartingKarts && (
                                            <span className="text-sm text-red-500">
                                                {errors.noOfStartingKarts.message}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        {...register("noOfStartingKarts", {
                                            required: "Required.",
                                            validate: {
                                                isNumber: (x) => !isNaN(x) || "Has to be a number.",
                                                isAboveMin: (x) =>
                                                    x >= 1 || "Has to be at least 1.",
                                                isBelowMax: (x) => {
                                                    const { noOfTotalKarts } = getValues();
                                                    return (
                                                        Number(x) <= Number(noOfTotalKarts) ||
                                                        "Can't exceed the total."
                                                    );
                                                }
                                            }
                                        })}
                                        id="noOfStartingKarts"
                                        type="text"
                                        isInvalid={!!errors.noOfStartingKarts}
                                        placeholder="No. of starting karts..."
                                    />
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-baseline">
                                        <label className="flex-1 mb-2 font-bold" htmlFor="noOfPits">
                                            How many pit lanes?
                                        </label>

                                        {errors.noOfPits && (
                                            <span className="text-sm text-red-500">
                                                {errors.noOfPits.message}
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        {...noOfPitsRegister}
                                        id="noOfPits"
                                        type="text"
                                        isInvalid={!!errors.noOfPits}
                                        placeholder="No. of pits..."
                                        onChange={(e) => {
                                            noOfPitsRegister.onChange(e);
                                            handleNoOfPitsChange(e);
                                        }}
                                    />
                                </div>

                                {pitColors && (
                                    <div className="relative mt-4">
                                        <label className="font-bold">
                                            Choose your pit lane colors:
                                        </label>
                                        <div className="mt-2 space-y-3">
                                            {pitColors.map((x) => (
                                                <PitColorPicker
                                                    key={x.name}
                                                    name={x.name}
                                                    colorHex={x.colorHex}
                                                    onChange={() =>
                                                        console.log(
                                                            "will update the pit colors here"
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-3 mt-4 bg-gray-50">
                                <Button type="submit" isDisabled={isLoading}>
                                    <IconPlay />
                                    {isLoading ? (
                                        <span>Creating Event...</span>
                                    ) : (
                                        <span>Continue</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </Layout>
    );
}

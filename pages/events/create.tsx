import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

import { useRouter } from "next/router";

import { groupedMapByStatusType } from "helpers/data";
import { useUser } from "hooks/UserHooks";

import PitColorMap from "entities/PitColorMap";
import PostEventResponseData from "entities/PostEventResponseData";
import EventComposite from "entities/EventComposite";
import StatusType from "entities/StatusType";

import Button from "components/Shared/Button";
import Input from "components/Shared/Input";
import IconPlay from "components/Shared/IconPlay";
import LoadingIndicator from "components/Shared/LoadingIndicator";
import Layout from "components/Shared/Layout";

import PitColorPicker from "components/EventCreate/PitColorPicker";
import { Kart } from "@prisma/client";

type CreateFormInputs = {
    name: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfPits: number;
    pitColorMaps: PitColorMap[];
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

// TODO: Get better default colors from the users
const DEFAULT_PIT_COLORS_MAP = {
    0: "#EF4444",
    1: "#10B981",
    2: "#FCD34D",
    3: "#3B82F6",
    4: "#8B5CF6"
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
    const [pitColorMaps, setPitColorMaps] = useState<PitColorMap[]>();

    const { user } = useUser({ redirectTo: "/login" });

    async function onSubmit(data: CreateFormInputs) {
        // include the pit color map into the form input
        const newData: CreateFormInputs = {
            ...data,
            pitColorMaps
        };

        setIsLoading(true);

        // When creating a new event push it to the cache and re-validate entries (we already have it in the response)
        await mutate("/api/events/composite", async (events: EventComposite[]) => {
            const { event, karts, pits } = await createEvent(newData);
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

            setPitColorMaps(newPitColors);
        } else {
            setPitColorMaps(null);
        }
    }

    function handlePitColorPickerChange(name: string, colorHex: string) {
        setPitColorMaps(pitColorMaps.map((x) => (x.name === name ? { ...x, colorHex } : x)));
    }

    return (
        <Layout pageTitle="Visor - Create Event">
            <div className="flex flex-col items-center">
                <main role="main" className="w-2/4">
                    <h1 className="text-4xl font-bold tracking-tight">Create Event</h1>

                    <div className="translate-x-0 translate-y-0">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-16 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-300 bg-white shadow"
                        >
                            <div className="px-6 py-3">
                                <div className="mt-4">
                                    <div className="flex items-baseline">
                                        <label className="mb-2 flex-1 font-bold" htmlFor="name">
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
                                            className="mb-2 flex-1 font-bold"
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
                                            className="mb-2 flex-1 font-bold"
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
                                        <label className="mb-2 flex-1 font-bold" htmlFor="noOfPits">
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

                                {pitColorMaps && (
                                    <div className="relative mt-4">
                                        <label className="font-bold">
                                            Choose your pit lane colors:
                                        </label>
                                        <div className="mt-2 space-y-3">
                                            {pitColorMaps.map((x) => (
                                                <PitColorPicker
                                                    key={x.name}
                                                    name={x.name}
                                                    colorHex={x.colorHex}
                                                    onChange={(newColor: string) =>
                                                        handlePitColorPickerChange(x.name, newColor)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 bg-gray-50 px-6 py-3">
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

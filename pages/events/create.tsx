import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Head from "next/head";
import { useRouter } from "next/dist/client/router";

import IconPlay from "components/Shared/IconPlay";
import Input from "components/Shared/Input";
import PostEventResponseData from "entities/PostEventResponseData";
import { mutate } from "swr";
import EventComposite from "entities/EventComposite";
import StatusType from "entities/StatusType";
import Kart from "entities/Kart";

type CreateFormInputs = {
    name: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfBoxes: number;
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

function groupedMapByStatusType(karts: Kart[]): Map<StatusType, Kart[]> {
    let initialMap = new Map<StatusType, Kart[]>();
    initialMap.set(StatusType.Racing, []);
    initialMap.set(StatusType.Idle, []);
    initialMap.set(StatusType.Box, []);

    return karts.reduce(
        (map: Map<StatusType, Kart[]>, kart) =>
            map.set(kart.statusType, [...(map.get(kart.statusType) || []), kart]),
        initialMap
    );
}

export default function Setup() {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm<CreateFormInputs>();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function onSubmit(data: CreateFormInputs) {
        setIsLoading(true);

        // When creating a new event push it to the cache and re-validate entries (we already have it in the response)
        await mutate("/api/events/composite", async (events: EventComposite[]) => {
            const { event, karts, boxes } = await createEvent(data);
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
                    noOfKartsInBox: grouped.get(StatusType.Box).length,
                    noOfBoxes: boxes.length
                }
            ];
        });

        setIsLoading(false);

        router.push("/events");
    }

    return (
        <>
            <Head>
                <title>Visor - Create Event</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col items-center">
                <main className="w-2/4">
                    <h1 className="text-4xl font-bold tracking-tight">Create Event</h1>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-16 bg-white border rounded-lg shadow divide-y divide-gray-200"
                    >
                        <div className="px-6 py-3">
                            <div className="mt-4">
                                <div className="flex items-baseline">
                                    <label
                                        className="flex-1 mb-2 font-bold text-gray-700"
                                        htmlFor="name"
                                    >
                                        What's the name of the event?
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
                                        className="flex-1 mb-2 font-bold text-gray-700"
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
                                            isAboveMin: (x) => x >= 1 || "Has to be at least 1.",
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
                                        className="flex-1 mb-2 font-bold text-gray-700"
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
                                            isAboveMin: (x) => x >= 1 || "Has to be at least 1.",
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
                                    <label
                                        className="flex-1 mb-2 font-bold text-gray-700"
                                        htmlFor="noOfBoxes"
                                    >
                                        How many boxes?
                                    </label>

                                    {errors.noOfBoxes && (
                                        <span className="text-sm text-red-500">
                                            {errors.noOfBoxes.message}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    {...register("noOfBoxes", {
                                        required: "Required.",
                                        validate: {
                                            isNumber: (x) => !isNaN(x) || "Has to be a number.",
                                            isAboveMin: (x) => x >= 1 || "Has to be at least 1.",
                                            isBelowMax: (x) => x <= 5 || "Too many boxes, max is 5."
                                        }
                                    })}
                                    id="noOfBoxes"
                                    type="text"
                                    isInvalid={!!errors.noOfBoxes}
                                    placeholder="No. of boxes..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-3 mt-4 bg-gray-50">
                            <button
                                type="submit"
                                className={`flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                                    isLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-blue-700"
                                }`}
                                disabled={isLoading}
                            >
                                <IconPlay />
                                {isLoading ? <span>Creating Event...</span> : <span>Continue</span>}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}

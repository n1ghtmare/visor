import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

import Head from "next/head";
import { useRouter } from "next/router";

import { groupedMapByStatusType } from "helpers/data";

import PostEventResponseData from "entities/PostEventResponseData";
import EventComposite from "entities/EventComposite";
import StatusType from "entities/StatusType";
import Kart from "entities/Kart";
import Button from "components/Shared/Button";
import Input from "components/Shared/Input";
import IconPlay from "components/Shared/IconPlay";

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
                                    {...register("noOfPits", {
                                        required: "Required.",
                                        validate: {
                                            isNumber: (x) => !isNaN(x) || "Has to be a number.",
                                            isAboveMin: (x) => x >= 1 || "Has to be at least 1.",
                                            isBelowMax: (x) => x <= 5 || "Too many pits, max is 5."
                                        }
                                    })}
                                    id="noOfPits"
                                    type="text"
                                    isInvalid={!!errors.noOfPits}
                                    placeholder="No. of pits..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-3 mt-4 bg-gray-50">
                            <Button type="submit" isDisabled={isLoading}>
                                <IconPlay />
                                {isLoading ? <span>Creating Event...</span> : <span>Continue</span>}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}

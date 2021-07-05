import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Head from "next/head";

import IconPlay from "components/Shared/IconPlay";
import Input from "components/Shared/Input";
import CreateRaceResponseData from "entities/CreateRaceResponseData";
import { useRouter } from "next/dist/client/router";

type SetupInputs = {
    raceName: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfBoxes: number;
};

async function createRace(data: SetupInputs): Promise<JSON> {
    const response = await fetch("/api/race/create", {
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

    return serverData;
}

export default function Setup() {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm<SetupInputs>();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function onSubmit(data: SetupInputs) {
        setIsLoading(true);

        const response = await fetch("/api/race/create", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(response.status.toString());
        }

        setIsLoading(false);
        const serverData = (await response.json()) as CreateRaceResponseData;
        // TODO: Put this into SWR instead of re-fetching it again

        // Redirect to the race/index page
        router.push("/race");
    }

    return (
        <>
            <Head>
                <title>Visor - Setup Race</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="w-1/4">
                <h1 className="text-4xl font-bold">Setup Race</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
                    <div className="mt-4">
                        <div className="flex items-baseline">
                            <label
                                className="flex-1 mb-2 font-bold text-gray-700"
                                htmlFor="raceName"
                            >
                                What's the name of the race (event)?
                            </label>

                            {errors.raceName && (
                                <span className="text-sm text-red-500">
                                    {errors.raceName.message}
                                </span>
                            )}
                        </div>
                        <Input
                            {...register("raceName", {
                                required: "Required.",
                                minLength: 2
                            })}
                            id="raceName"
                            type="text"
                            isInvalid={!!errors.raceName}
                            placeholder="Name of race..."
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
                                    isBelowMax: (x) => x <= 200 || "Too many karts, max is 200."
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
                    <div className="mt-8">
                        <button
                            type="submit"
                            className={`flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                            disabled={isLoading}
                        >
                            <IconPlay />
                            {isLoading ? <span>Creating race...</span> : <span>Continue</span>}
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}

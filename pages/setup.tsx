// This should contain:
// - No of starting karts
// - No of total karts
// - No of boxes

// py-3 px-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600
import Head from "next/head";
import React from "react";
import { useForm } from "react-hook-form";

import IconPlay from "components/Shared/IconPlay";
import Input from "components/Shared/Input";

type SetupInputs = {
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfBoxes: number;
};

export default function Setup() {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm<SetupInputs>();

    async function onSubmit(data: SetupInputs) {
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
        console.log({ serverData });
    }

    return (
        <>
            <Head>
                <title>Visor - Setup Race</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="w-1/4">
                <h1 className="text-4xl font-bold">Setup Race</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
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
                            className="flex items-center px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            type="submit"
                        >
                            <IconPlay />
                            <span>Continue</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

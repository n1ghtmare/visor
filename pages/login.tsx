import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useUser } from "hooks/UserHooks";

import UserComposite from "entities/UserComposite";

import Button from "components/Shared/Button";
import Input from "components/Shared/Input";
import IconLogin from "components/Shared/IconLogin";
import LoadingIndicator from "components/Shared/LoadingIndicator";
import Layout from "components/Shared/Layout";

type LoginFormInputs = {
    username: string;
    password: string;
};

async function login(data: LoginFormInputs): Promise<UserComposite> {
    const response = await fetch("/api/login", {
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

    return serverData as UserComposite;
}

export default function Login() {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { mutateUser } = useUser({
        redirectTo: "/events",
        redirectIfFound: true
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

    async function onSubmit(data: LoginFormInputs) {
        setIsLoading(true);

        try {
            mutateUser(await login(data));
        } catch (error) {
            console.error("Something went wrong: ", { error });

            setErrorMessage("Can't log you in, make sure you're providing valid credentials.");
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <Layout pageTitle="Visor - Loading data..." shouldDisplayHeader={false}>
                <LoadingIndicator />
            </Layout>
        );
    }

    return (
        <Layout pageTitle="Visor - Login" shouldDisplayHeader={false}>
            <div className="flex flex-col items-center">
                <main role="main" className="w-full md:w-96">
                    <h1 className="text-4xl font-bold tracking-tight">Login</h1>

                    <form
                        className="mt-16 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-300 bg-white shadow"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4 p-6">
                            {errorMessage && (
                                <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <div className="flex items-baseline">
                                    <label className="mb-2 flex-1 font-bold" htmlFor="username">
                                        Username
                                    </label>

                                    {errors.username && (
                                        <span className="text-sm text-red-500">
                                            {errors.username.message}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    {...register("username", { required: "Required." })}
                                    id="username"
                                    type="text"
                                    isInvalid={!!errors.username}
                                    placeholder="Your username..."
                                />
                            </div>

                            <div>
                                <div className="flex items-baseline">
                                    <label className="mb-2 flex-1 font-bold" htmlFor="password">
                                        Password
                                    </label>

                                    {errors.password && (
                                        <span className="text-sm text-red-500">
                                            {errors.password.message}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    {...register("password", { required: "Required." })}
                                    id="password"
                                    type="password"
                                    isInvalid={!!errors.password}
                                    placeholder="Your password..."
                                />
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3">
                            <Button type="submit">
                                <IconLogin />
                                <span>Login</span>
                            </Button>
                        </div>
                    </form>
                </main>
            </div>
        </Layout>
    );
}

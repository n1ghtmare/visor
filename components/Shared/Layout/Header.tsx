import { useRouter } from "next/router";

import { useUser } from "hooks/UserHooks";

import UserComposite from "entities/UserComposite";

async function logout(): Promise<UserComposite> {
    const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(response.status.toString());
    }

    return (await response.json()) as UserComposite;
}

export default function Header() {
    const { user, mutateUser } = useUser();
    const router = useRouter();

    async function handleLogoutClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();

        mutateUser(await logout(), false);
        router.push("/login");
    }

    return (
        <>
            <div className="flex items-baseline py-2 lg:mx-auto lg:w-9/12 divide-x divide-dashed divide-gray-400">
                <div className="flex-1">
                    {/*
                    <div className="inline-block px-2 text-2xl font-bold tracking-tighter border-b-4 border-t-4 border-dashed border-gray-400">
                        visor
                    </div>
                    */}
                </div>
                {user?.isLoggedIn && (
                    <>
                        <div className="px-4">
                            <div>
                                Logged in as: <strong>{user.displayName}</strong>
                            </div>
                        </div>
                        <div className="pl-4">
                            <a
                                className="inline-flex items-center text-blue-600 space-x-1 hover:text-blue-800 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                href="/api/logout"
                                onClick={handleLogoutClick}
                            >
                                <span>logout</span>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

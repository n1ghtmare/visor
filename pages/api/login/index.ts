import bcrypt from "bcrypt";
import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";
import { getUserByUsername } from "database/repository";

import UserComposite from "entities/UserComposite";
import User from "entities/User";

type LoginRequestData = {
    username: string;
    password: string;
};

export default withSession(
    async (req: NextIronRequest, res: NextApiResponse<UserComposite | { message?: string }>) => {
        if (req.method !== "POST") {
            res.status(405).json({ message: "Method not allowed" });
            return;
        }

        // dev password: log me into visor | $2a$12$6w09Cc7qFJPykqtHYdQ1qeuZPxJdvYCWRHYE.joJWCdg/WdErWSP2
        const { username, password } = (await req.body) as LoginRequestData;

        const user: User = await getUserByUsername(username);

        if (!user) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }

        if (await comparePassword(password, user.password)) {
            const userComposite: UserComposite = {
                isLoggedIn: true,
                id: user.id,
                displayName: user.displayName
            };

            // save the user into a session cookie
            req.session.set<UserComposite>("currentUser", userComposite);
            await req.session.save();

            res.status(200).json(userComposite);
        } else {
            res.status(403).json({ isLoggedIn: false, message: "Forbidden" });
        }
    }
);

async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.log(error);
    }
    return false;
}

import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";

import UserComposite from "entities/UserComposite";

export default withSession(
    async (req: NextIronRequest, res: NextApiResponse<UserComposite | { message?: string }>) => {
        if (req.method !== "GET") {
            res.status(405).json({ message: "Method not allowed" });
            return;
        }

        const user = req.session.get<UserComposite>("currentUser");

        // TODO: Return proper HTTP error codes for other types/methods of request
        if (user) {
            res.status(200).json({ isLoggedIn: true, ...user });
        } else {
            res.status(200).json({ isLoggedIn: false });
        }
    }
);

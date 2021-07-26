import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";

import UserComposite from "entities/UserComposite";

export default withSession(async (req: NextIronRequest, res: NextApiResponse<UserComposite>) => {
    req.session.destroy();
    res.status(200).json({ isLoggedIn: false });
});

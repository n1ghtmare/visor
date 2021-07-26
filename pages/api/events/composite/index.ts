import { NextApiResponse } from "next";

import { getEventCompositesByUserId } from "database/repository";
import withSession, { NextIronRequest } from "helpers/session";
import sleep from "helpers/sleep";

import EventComposite from "entities/EventComposite";
import UserComposite from "entities/UserComposite";

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
    const currentUser = req.session.get<UserComposite>("currentUser");

    if (!currentUser) {
        res.status(403).json({ message: "Forbidden" });
    }

    // GET: api/events/composite
    if (req.method === "GET") {
        await sleep(3000);
        const events: EventComposite[] = await getEventCompositesByUserId(currentUser.id);
        res.status(200).json(events);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
});

import { NextApiRequest, NextApiResponse } from "next";

import { getEventComposites } from "database/repository";
import sleep from "helpers/sleep";

import EventComposite from "entities/EventComposite";

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET: api/events/composite
    if (req.method === "GET") {
        await sleep(3000);
        const events: EventComposite[] = await getEventComposites(MOCK_USER_ID);
        res.status(200).json(events);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

import { NextApiRequest, NextApiResponse } from "next";

import { getEvents } from "database/repository";

import EventComposite from "entities/EventComposite";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET: api/events/composite
    if (req.method === "GET") {
        await sleep(3000);
        const events: EventComposite[] = await getEvents(MOCK_USER_ID);
        res.status(200).json(events);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";
import { validateRequestAndGetEvent } from "helpers/api";

import { getPitsByEventId } from "database/repository";
import { Pit, Event } from "@prisma/client";

async function handleGet(req: NextIronRequest, res: NextApiResponse) {
    const event: Event = await validateRequestAndGetEvent(req, res);
    const pits: Pit[] = await getPitsByEventId(event.id);

    res.status(200).json(pits);
}

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
    // GET: api/events/[id]/pits
    if (req.method === "GET") {
        await handleGet(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
});

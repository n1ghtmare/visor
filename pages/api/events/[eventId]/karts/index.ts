import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";
import { validateRequestAndGetEvent } from "helpers/api";

import { getKartsByEventId } from "database/repository";
import { Kart, Event } from "@prisma/client";

async function handleGet(req: NextIronRequest, res: NextApiResponse) {
    const event: Event = await validateRequestAndGetEvent(req, res);
    const karts: Kart[] = await getKartsByEventId(event.id);

    res.status(200).json(karts);
}

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
    // GET: api/events/[id]/karts
    if (req.method === "GET") {
        await handleGet(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
});

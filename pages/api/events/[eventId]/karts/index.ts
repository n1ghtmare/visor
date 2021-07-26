import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";
import { validateRequestAndGetEvent } from "helpers/api";
import sleep from "helpers/sleep";
import { getKartsByEventId } from "database/repository";

import Event from "entities/Event";
import Kart from "entities/Kart";

async function handleGet(req: NextIronRequest, res: NextApiResponse) {
    // TODO: Remove before production
    // simulate long working hours
    await sleep(3000);

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

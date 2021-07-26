import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";
import { validateRequestAndGetEvent } from "helpers/api";
import sleep from "helpers/sleep";
import { getKart, updateKart } from "database/repository";

import Event from "entities/Event";
import Kart from "entities/Kart";

async function handlePut(req: NextIronRequest, res: NextApiResponse) {
    // TODO: Remove before production
    // simulate long working hours
    await sleep(3000);

    const event: Event = await validateRequestAndGetEvent(req, res);

    const { kartId } = req.query;
    const kart: Kart = await getKart(kartId as string);

    // Validate the kart as well - we can't call a kart that doesn't belong to the event (missmatch)
    if (kart.eventId !== event.id) {
        res.status(403).json({ message: "Forbidden" });
    }

    const requestKart = req.body as Kart;

    if (kart.id === requestKart.id) {
        await updateKart(requestKart);
    }

    res.status(200).json({ message: `Success updating kart with id: ${event.id}` });
}

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
    // DELETE: api/events/[id]/karts/[id]
    if (req.method === "PUT") {
        await handlePut(req, res);
    }
    // no other request types are allowed
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
});

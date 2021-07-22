import { NextApiRequest, NextApiResponse } from "next";

import { deleteEvent } from "database/repository";
import { validateRequestAndGetEvent } from "helpers/api";
import sleep from "helpers/sleep";

import Event from "entities/Event";

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    // TODO: Remove before production
    // simulate long working hours
    await sleep(3000);

    const event: Event = await validateRequestAndGetEvent(req, res);

    await deleteEvent(event.id);

    res.status(200).json({ message: `Success deleting event with id: ${event.id}` });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    // TODO: Remove before production
    // simulate long working hours
    await sleep(3000);

    const event: Event = await validateRequestAndGetEvent(req, res);

    res.status(200).json(event);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET: api/events/[id]
    if (req.method === "GET") {
        await handleGet(req, res);
    }
    // DELETE: api/events/[id]
    else if (req.method === "DELETE") {
        await handleDelete(req, res);
    }
    // no other request types are allowed
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

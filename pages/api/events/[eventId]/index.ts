import { NextApiResponse } from "next";

import { deleteEvent } from "database/repository";
import { validateRequestAndGetEvent } from "helpers/api";

import Event from "entities/Event";
import withSession, { NextIronRequest } from "helpers/session";

async function handleDelete(req: NextIronRequest, res: NextApiResponse) {
    const event: Event = await validateRequestAndGetEvent(req, res);
    await deleteEvent(event.id);

    res.status(200).json({ message: `Success deleting event with id: ${event.id}` });
}

async function handleGet(req: NextIronRequest, res: NextApiResponse) {
    const event: Event = await validateRequestAndGetEvent(req, res);

    res.status(200).json(event);
}

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
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
});

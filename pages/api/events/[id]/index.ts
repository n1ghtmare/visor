import { NextApiRequest, NextApiResponse } from "next";

import { deleteEvent, getEventById } from "database/repository";
import sleep from "helpers/sleep";

import Event from "entities/Event";

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    // TODO: Remove before production
    // simulate long working hours
    await sleep(3000);

    const { id } = req.query;
    const eventId = parseInt(id as string, 10);

    if (isNaN(eventId)) {
        res.status(400).json({ message: "Bad Request" });
    }

    const event: Event = await getEventById(eventId);

    // Ensure that the event is owned by the current user if in future we have more than one user
    if (event.createdByUserId === MOCK_USER_ID) {
        await deleteEvent(event.id);
    }

    res.status(200).json({ message: `Success deleting event with id: ${id}` });
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // DELETE: api/events/[id]
    if (req.method === "DELETE") {
        await handleDelete(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

import { NextApiRequest, NextApiResponse } from "next";

import { getEventById } from "database/repository";

import Event from "entities/Event";

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export async function validateRequestAndGetEvent(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<Event> {
    const eventId = parseInt(req.query.id as string, 10);

    if (isNaN(eventId)) {
        res.status(400).json({ message: "Bad Request" });
    }

    const event: Event = await getEventById(eventId);

    // Ensure that the event is owned by the current user if in future we have more than one user
    if (event.createdByUserId !== MOCK_USER_ID) {
        res.status(403).json({ message: "Forbidden" });
    }

    return event;
}

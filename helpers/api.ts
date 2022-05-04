import { NextApiResponse } from "next";

import { NextIronRequest } from "./session";
import { getEvent } from "database/repository";

import { Event } from "@prisma/client";
import UserComposite from "entities/UserComposite";

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export async function validateRequestAndGetEvent(
    req: NextIronRequest,
    res: NextApiResponse
): Promise<Event> {
    const currentUser = req.session.get<UserComposite>("currentUser");

    if (!currentUser) {
        res.status(403).json({ message: "Forbidden" });
    }

    const eventId: number = parseInt(req.query.eventId as string, 10);

    if (isNaN(eventId)) {
        res.status(400).json({ message: "Bad Request" });
    }

    const event: Event = await getEvent(eventId);

    // Ensure that the event is owned by the current user if in future we have more than one user
    if (event.createdByUserId !== currentUser.id) {
        res.status(403).json({ message: "Forbidden" });
    }

    return event;
}

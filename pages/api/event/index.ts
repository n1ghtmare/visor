import { NextApiRequest, NextApiResponse } from "next";

import openConnection from "database/connection";

import EventSummary from "entities/EventSummary";

async function getEvents(userId: number): Promise<EventSummary[]> {
    const db = await openConnection();

    const result = await db.all(
        `SELECT
            e.id,
            e.name,
            (SELECT COUNT(id) FROM karts WHERE event_id = e.id) AS noOfKartsTotal,
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 2 AND event_id = e.id) AS noOfKartsInRace,
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 3 AND event_id = e.id) AS noOfKartsInBox,
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 1 AND event_id = e.id) AS noOfKartsIdle,
            (SELECT COUNT(id) FROM boxes WHERE event_id = e.id) AS noOfBoxes,
            created_by_user_id AS createdByUserId,
            created_on_date AS createdOnDate
        FROM events AS e
        WHERE e.created_by_user_id = ?`,
        [userId]
    );

    await db.close();

    return result as EventSummary[];
}

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const events: EventSummary[] = await getEvents(MOCK_USER_ID);
        res.status(200).json(events);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

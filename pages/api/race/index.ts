import { NextApiRequest, NextApiResponse } from "next";

import openConnection from "database/connection";

import Race from "entities/Race";

async function getRaces(userId: number): Promise<Race[]> {
    const db = await openConnection();

    const result = await db.all(
        `SELECT
            id,
            name,
            created_by_user_id AS createdByUserId,
            created_on_date AS createdOnDate
        FROM races
        WHERE created_by_user_id = ?`,
        [userId]
    );
    await db.close();

    return result as Race[];
}

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const races: Race[] = await getRaces(MOCK_USER_ID);
        console.log({ races });
        res.status(200).json(races);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

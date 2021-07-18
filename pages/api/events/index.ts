import { NextApiRequest, NextApiResponse } from "next";

import { createEvent, createPits, createKarts } from "database/repository";

import Event from "entities/Event";
import Pit from "entities/Pit";
import Kart from "entities/Kart";
import PostEventResponseData from "entities/PostEventResponseData";

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

type PostRequestData = {
    name: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfPits: number;
};

// Routes Design for the API:
// api/events POST
// api/events/composite/index GET
// api/events/[id]/karts/composite GET
// api/events/[id]/pits GET

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const requestData = req.body as PostRequestData;

    const event: Event = await createEvent(requestData.name, MOCK_USER_ID);
    const pits: Pit[] = await createPits(event.id, requestData.noOfPits);
    const karts: Kart[] = await createKarts(
        event.id,
        requestData.noOfTotalKarts,
        requestData.noOfStartingKarts
    );

    const responseData: PostEventResponseData = {
        event,
        pits,
        karts
    };

    res.status(200).json(responseData);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // POST: api/events
    if (req.method === "POST") {
        console.log("WILL NOW POST EH");
        await handlePost(req, res);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

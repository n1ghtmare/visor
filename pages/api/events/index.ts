import { NextApiResponse } from "next";

import withSession, { NextIronRequest } from "helpers/session";
import { createEvent, createPits, createKarts } from "database/repository";

import Event from "entities/Event";
import Pit from "entities/Pit";
import Kart from "entities/Kart";
import PostEventResponseData from "entities/PostEventResponseData";
import UserComposite from "entities/UserComposite";
import PitColorMap from "entities/PitColorMap";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

type PostRequestData = {
    name: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    pitColorMaps: PitColorMap[];
};

// Routes Design for the API (authenticated):
// api/events POST
// api/events/composite/index GET
// api/events/[id]/karts/composite GET
// api/events/[id]/pits GET

async function handlePost(req: NextIronRequest, res: NextApiResponse, currentUser: UserComposite) {
    const requestData = req.body as PostRequestData;

    const event: Event = await createEvent(requestData.name, currentUser.id);
    const pits: Pit[] = await createPits(event.id, requestData.pitColorMaps);
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

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
    const currentUser = req.session.get<UserComposite>("currentUser");

    if (!currentUser) {
        res.status(403).json({ message: "Forbidden" });
    }

    // POST: api/events
    if (req.method === "POST") {
        await handlePost(req, res, currentUser);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
});

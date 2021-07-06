import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import openConnection from "database/connection";

import Box from "entities/Box";
import Kart from "entities/Kart";
import ClassificationType from "entities/ClassificationType";
import StatusType from "entities/StatusType";
import Event from "entities/Event";
import CreateEventResponseData from "entities/CreateEventResponseData";

type RequestData = {
    eventName: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfBoxes: number;
};

const NO_OF_POSSIBLE_COLORS = 256 ** 3;

const getRandomColorHex = (): string =>
    `#${Math.floor(Math.random() * NO_OF_POSSIBLE_COLORS).toString(16)}`;

// TODO: Do better error handling here...
async function createBoxes(eventId: number, noOfBoxes: number): Promise<Box[]> {
    const boxes: Box[] = [];

    const db = await openConnection();

    let stmt = await db.prepare(
        "INSERT INTO boxes VALUES ($id, $eventId, $name, $colorHex, $description)"
    );

    for (let i = 0; i < noOfBoxes; i++) {
        var box: Box = {
            id: uuidv4(),
            eventId,
            name: `Box ${i + 1}`,
            colorHex: getRandomColorHex(),
            description: null
        };

        await stmt.run({
            $id: box.id,
            $eventId: box.eventId,
            $name: box.name,
            $colorHex: box.colorHex,
            $description: null
        });

        boxes.push(box);
    }

    await stmt.finalize();
    await db.close();

    return boxes;
}

async function createKarts(
    eventId: number,
    noOfTotalKarts: number,
    noOfStartingKarts: number
): Promise<Kart[]> {
    const karts: Kart[] = [];

    const db = await openConnection();

    let stmt = await db.prepare(
        `INSERT INTO karts VALUES (
            $id,
            $eventId,
            $statusType,
            $eventNo,
            $previousEventNo,
            $classificationType,
            $boxId,
            $markdownNotes
        )`
    );

    for (let i = 0; i < noOfTotalKarts; i++) {
        var kart: Kart = {
            id: uuidv4(),
            eventId: eventId,
            statusType: StatusType.Idle,
            classificationType: ClassificationType.Normal
        };

        if (i < noOfStartingKarts) {
            kart.eventNo = i + 1;
            kart.statusType = StatusType.Racing;
        }

        await stmt.run({
            $id: kart.id,
            $eventId: kart.eventId,
            $statusType: kart.statusType,
            $eventNo: kart.eventNo,
            $previousEventNo: kart.previousEventNo,
            $classificationType: kart.classificationType,
            $boxId: kart.boxId,
            $markdownNotes: kart.markdownNotes
        });

        karts.push(kart);
    }

    await stmt.finalize();
    await db.close();

    return karts;
}

async function createEvent(name: string, userId: number): Promise<Event> {
    let event: Event = {
        id: null,
        name,
        createdByUserId: userId,
        createdOnDate: new Date()
    };

    const db = await openConnection();

    // TODO: We need to test this here (are the dates in the correct UTC ISO8601 format)
    const result = await db.run(
        "INSERT INTO events (name, created_by_user_id, created_on_date) VALUES (?, ?, ?)",
        [name, userId, event.createdOnDate.toISOString()]
    );

    await db.close();

    event.id = result.lastID;

    return event;
}

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const requestData = req.body as RequestData;

        const event: Event = await createEvent(requestData.eventName, MOCK_USER_ID);

        let responseData: CreateEventResponseData = {
            event,
            boxes: await createBoxes(event.id, requestData.noOfBoxes),
            karts: await createKarts(
                event.id,
                requestData.noOfTotalKarts,
                requestData.noOfStartingKarts
            )
        };

        res.status(200).json(responseData);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

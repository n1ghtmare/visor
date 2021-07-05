import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import openConnection from "database/connection";

import Box from "entities/Box";
import Kart from "entities/Kart";
import ClassificationType from "entities/ClassificationType";
import StatusType from "entities/StatusType";
import Race from "entities/Race";
import CreateRaceResponseData from "entities/CreateRaceResponseData";

type RequestData = {
    raceName: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfBoxes: number;
};

const NO_OF_POSSIBLE_COLORS = 256 ** 3;

const getRandomColorHex = (): string =>
    `#${Math.floor(Math.random() * NO_OF_POSSIBLE_COLORS).toString(16)}`;

// TODO: Do better error handling here...
async function createBoxes(raceId: number, noOfBoxes: number): Promise<Box[]> {
    const boxes: Box[] = [];

    const db = await openConnection();

    let stmt = await db.prepare(
        "INSERT INTO boxes VALUES ($id, $raceId, $name, $colorHex, $description)"
    );

    for (let i = 0; i < noOfBoxes; i++) {
        var box: Box = {
            id: uuidv4(),
            raceId,
            name: `Box ${i + 1}`,
            colorHex: getRandomColorHex(),
            description: null
        };

        await stmt.bind({
            $id: box.id,
            $raceId: box.raceId,
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
    raceId: number,
    noOfTotalKarts: number,
    noOfStartingKarts: number
): Promise<Kart[]> {
    const karts: Kart[] = [];

    const db = await openConnection();

    let stmt = await db.prepare(
        `INSERT INTO karts VALUES (
            $id,
            $raceId,
            $statusType,
            $raceNo,
            $previousRaceNo,
            $classificationType,
            $boxId,
            $markdownNotes
        )`
    );

    for (let i = 0; i < noOfTotalKarts; i++) {
        var kart: Kart = {
            id: uuidv4(),
            raceId,
            statusType: StatusType.Idle,
            classificationType: ClassificationType.Normal
        };

        if (i < noOfStartingKarts) {
            kart.raceNo = i + 1;
            kart.statusType = StatusType.Racing;
        }

        await stmt.bind({
            $id: kart.id,
            $raceId: kart.raceId,
            $statusType: kart.statusType,
            $raceNo: kart.raceNo,
            $previousRaceNo: kart.previousRaceNo,
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

async function createRace(name: string, userId: number): Promise<Race> {
    let race: Race = {
        id: null,
        name,
        createdByUserId: userId,
        createdOnDate: new Date()
    };

    const db = await openConnection();

    // TODO: We need to test this here (are the dates in the correct UTC ISO8601 format)
    const result = await db.run(
        "INSERT INTO races (name, created_by_user_id, created_on_date) VALUES (?, ?, ?)",
        [name, userId, race.createdOnDate.toISOString()]
    );

    await db.close();

    race.id = result.lastID;

    return race;
}

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const requestData = req.body as RequestData;

        const race: Race = await createRace(requestData.raceName, MOCK_USER_ID);

        let responseData: CreateRaceResponseData = {
            race,
            boxes: await createBoxes(race.id, requestData.noOfBoxes),
            karts: await createKarts(
                race.id,
                requestData.noOfTotalKarts,
                requestData.noOfStartingKarts
            )
        };

        res.status(200).json(responseData);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

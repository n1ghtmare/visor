import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

import db from "database/connection";

import Box from "entities/Box";
import Kart from "entities/Kart";
import ClassificationType from "entities/ClassificationType";
import StatusType from "entities/StatusType";
import Race from "entities/Race";

type RequestData = {
    raceName: string;
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfBoxes: number;
};

type ResponseData = {
    race: Race;
    boxes: Box[];
    karts: Kart[];
};

const NO_OF_POSSIBLE_COLORS = 256 ** 3;

const getRandomColorHex = (): string =>
    `#${Math.floor(Math.random() * NO_OF_POSSIBLE_COLORS).toString(16)}`;

// TODO: Do better error handling here...
function createBoxes(raceId: number, noOfBoxes: number): Box[] {
    const boxes: Box[] = [];

    let stmt = db.prepare(
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

        stmt.run({
            $id: box.id,
            $raceId: box.raceId,
            $name: box.name,
            $colorHex: box.colorHex,
            $description: null
        });

        boxes.push(box);
    }

    stmt.finalize();

    return boxes;
}

function createKarts(raceId: number, noOfTotalKarts: number, noOfStartingKarts: number): Kart[] {
    const karts: Kart[] = [];

    let stmt = db.prepare(
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

        stmt.run({
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

    stmt.finalize();

    return karts;
}

function createRace(name: string, userId: number): Race {
    let race: Race = {
        id: null,
        name,
        createdByUserId: userId,
        createdOnDate: new Date()
    };

    // TODO: We need to test this here (are the dates in the correct UTC ISO8601 format)
    db.run(
        "INSERT INTO races (name, created_by_user_id, created_on_date) VALUES (?, ?, ?)",
        [name, userId, race.createdOnDate.toISOString()],
        function (error: Error) {
            if (error) {
                console.log("Couldn't insert into table races: ", error);
                throw error;
            }

            console.log("lastID: ", this.lastID);

            // FIXME: This doesn't update the id correctly it's working in a closure
            race.id = this.lastID;
        }
    );

    return race;
}

// TODO: needs to be removed and we need to get it from the session
const MOCK_USER_ID = 1;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const requestData = req.body as RequestData;

        const race: Race = createRace(requestData.raceName, MOCK_USER_ID);
        console.log("Race created: ", { race });

        let responseData: ResponseData = {
            race,
            boxes: createBoxes(race.id, requestData.noOfBoxes),
            karts: createKarts(race.id, requestData.noOfTotalKarts, requestData.noOfStartingKarts)
        };

        res.status(200).json(responseData);
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

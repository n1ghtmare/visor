import { v4 as uuidv4 } from "uuid";

import openConnection from "./connection";

import Event from "entities/Event";
import Box from "entities/Box";
import ClassificationType from "entities/ClassificationType";
import Kart from "entities/Kart";
import StatusType from "entities/StatusType";
import EventComposite from "entities/EventComposite";

const NO_OF_POSSIBLE_COLORS = 256 ** 3;

// FIXME: There is an issue here that this code produces shorter character colors (such as for example: #ffff)
const getRandomColorHex = (): string =>
    `#${Math.floor(Math.random() * NO_OF_POSSIBLE_COLORS).toString(16)}`;

export async function createBoxes(eventId: number, noOfBoxes: number): Promise<Box[]> {
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

export async function createKarts(
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

export async function createEvent(name: string, userId: number): Promise<Event> {
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

export async function getEvents(userId: number): Promise<EventComposite[]> {
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

    return result as EventComposite[];
}

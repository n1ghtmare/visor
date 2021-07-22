import { v4 as uuidv4 } from "uuid";

import openConnection from "./connection";

import Event from "entities/Event";
import Pit from "entities/Pit";
import ClassificationType from "entities/ClassificationType";
import Kart from "entities/Kart";
import StatusType from "entities/StatusType";
import EventComposite from "entities/EventComposite";

const NO_OF_POSSIBLE_COLORS = 256 ** 3;

// FIXME: There is an issue here that this code produces shorter character colors (such as for example: #ffff)
const getRandomColorHex = (): string =>
    `#${Math.floor(Math.random() * NO_OF_POSSIBLE_COLORS).toString(16)}`;

export async function createPits(eventId: number, noOfPits: number): Promise<Pit[]> {
    const pits: Pit[] = [];

    const db = await openConnection();

    const stmt = await db.prepare(
        "INSERT INTO pits VALUES ($id, $eventId, $name, $colorHex, $description)"
    );

    for (let i = 0; i < noOfPits; i++) {
        const pit: Pit = {
            id: uuidv4(),
            eventId,
            name: `Pit ${i + 1}`,
            colorHex: getRandomColorHex(),
            description: null
        };

        await stmt.run({
            $id: pit.id,
            $eventId: pit.eventId,
            $name: pit.name,
            $colorHex: pit.colorHex,
            $description: null
        });

        pits.push(pit);
    }

    await stmt.finalize();
    await db.close();

    return pits;
}

export async function createKarts(
    eventId: number,
    noOfTotalKarts: number,
    noOfStartingKarts: number
): Promise<Kart[]> {
    const karts: Kart[] = [];

    const db = await openConnection();

    const stmt = await db.prepare(
        `INSERT INTO karts VALUES (
            $id,
            $eventId,
            $statusType,
            $eventNo,
            $previousEventNo,
            $classificationType,
            $pitId,
            $markdownNotes
        )`
    );

    for (let i = 0; i < noOfTotalKarts; i++) {
        const kart: Kart = {
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
            $pitId: kart.pitId,
            $markdownNotes: kart.markdownNotes
        });

        karts.push(kart);
    }

    await stmt.finalize();
    await db.close();

    return karts;
}

export async function createEvent(name: string, userId: number): Promise<Event> {
    const event: Event = {
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

export async function deleteEvent(id: number): Promise<void> {
    const db = await openConnection();

    // TODO: Add a DB contstraint that would do cascade on delete
    await db.run("DELETE FROM karts WHERE event_id = ?", [id]);
    await db.run("DELETE FROM pits WHERE event_id = ?", [id]);
    await db.run("DELETE FROM events WHERE id = ?", [id]);

    await db.close();
}

export async function getEvent(id: number): Promise<Event> {
    const db = await openConnection();

    const result = await db.get(
        `SELECT
            id,
            name,
            created_by_user_id AS createdByUserId,
            created_on_date AS createdOnDate
        FROM events
        WHERE id = ?`,
        [id]
    );

    await db.close();

    return result as Event;
}

export async function getEventCompositesByUserId(userId: number): Promise<EventComposite[]> {
    const db = await openConnection();

    const result = await db.all(
        `SELECT
            e.id,
            e.name,
            (SELECT COUNT(id) FROM karts WHERE event_id = e.id) AS noOfKartsTotal,
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 2 AND event_id = e.id) AS noOfKartsInRace,
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 3 AND event_id = e.id) AS noOfKartsInPit,
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 1 AND event_id = e.id) AS noOfKartsIdle,
            (SELECT COUNT(id) FROM pits WHERE event_id = e.id) AS noOfPits,
            created_by_user_id AS createdByUserId,
            created_on_date AS createdOnDate
        FROM events AS e
        WHERE e.created_by_user_id = ?`,
        [userId]
    );

    await db.close();

    return result as EventComposite[];
}

export async function getKartsByEventId(eventId: number): Promise<Kart[]> {
    const db = await openConnection();

    const result = await db.all(
        `SELECT
            k.id,
            k.event_id AS eventId,
            k.status_type_id AS statusType,
            k.event_no AS eventNo,
            k.previous_event_no AS previousEventNo,
            k.classification_type_id AS classificationType,
            k.pit_id AS pitId,
            k.markdown_notes AS markdownNotes,
            p.name AS pitName,
            p.color_hex AS pitColorHex
        FROM karts AS k
        LEFT OUTER JOIN pits AS p ON k.pit_id = p.id
        WHERE k.event_id = ?`,
        [eventId]
    );

    await db.close();

    return result as Kart[];
}

export async function getKart(id: string): Promise<Kart> {
    const db = await openConnection();

    const result = await db.get(
        `SELECT
            k.id,
            k.event_id AS eventId,
            k.status_type_id AS statusType,
            k.event_no AS eventNo,
            k.previous_event_no AS previousEventNo,
            k.classification_type_id AS classificationType,
            k.pit_id AS pitId,
            k.markdown_notes AS markdownNotes,
            p.name AS pitName,
            p.color_hex AS pitColorHex
        FROM karts AS k
        LEFT OUTER JOIN pits AS p ON k.pit_id = p.id
        WHERE k.id = ?`,
        [id]
    );

    await db.close();

    return result as Kart;
}

export async function updateKart(kart: Kart): Promise<void> {
    const db = await openConnection();

    await db.run(
        `UPDATE karts SET
            status_type_id = ?,
            event_no = ?,
            previous_event_no = ?,
            classification_type_id = ?,
            pit_id = ?,
            markdown_notes = ?
        WHERE id = ?`,
        [
            kart.statusType,
            kart.eventNo,
            kart.previousEventNo,
            kart.classificationType,
            kart.pitId,
            kart.markdownNotes,
            kart.id
        ]
    );

    await db.close();
}

export async function getPitsByEventId(eventId: number): Promise<Pit[]> {
    const db = await openConnection();

    const result = await db.all(
        `SELECT
            id,
            event_id AS eventId,
            name,
            color_hex AS colorHex,
            description
        FROM pits
        WHERE event_id = ?`,
        [eventId]
    );

    await db.close();

    return result as Pit[];
}

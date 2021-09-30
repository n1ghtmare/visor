import { v4 as uuidv4 } from "uuid";

import query from "./connection";

import Event from "entities/Event";
import Pit from "entities/Pit";
import ClassificationType from "entities/ClassificationType";
import Kart from "entities/Kart";
import StatusType from "entities/StatusType";
import EventComposite from "entities/EventComposite";
import User from "entities/User";
import PitColorMap from "entities/PitColorMap";

export async function createPits(eventId: number, pitColorMaps: PitColorMap[]): Promise<Pit[]> {
    const pits: Pit[] = [];

    for (let i = 0; i < pitColorMaps.length; i++) {
        const pit: Pit = {
            id: uuidv4(),
            eventId,
            name: pitColorMaps[i].name,
            colorHex: pitColorMaps[i].colorHex,
            description: null
        };

        await query("INSERT INTO pits (id, event_id, name, color_hex) VALUES ($1, $2, $3, $4)", [
            pit.id,
            pit.eventId,
            pit.name,
            pit.colorHex
        ]);

        pits.push(pit);
    }

    return pits;
}

export async function createKarts(
    eventId: number,
    noOfTotalKarts: number,
    noOfStartingKarts: number
): Promise<Kart[]> {
    const karts: Kart[] = [];

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

        await query(
            `INSERT INTO karts (id, event_id, status_type_id, classification_type_id, event_no) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5
            )`,
            [kart.id, kart.eventId, kart.statusType, kart.classificationType, kart.eventNo]
        );

        karts.push(kart);
    }

    return karts;
}

export async function createEvent(name: string, userId: number): Promise<Event> {
    const event: Event = {
        id: null,
        name,
        createdByUserId: userId,
        createdOnDate: new Date()
        // TODO: Investigate if the date is already in UTC (https://stackoverflow.com/questions/57810435/get-utc-date-not-utc-string-in-javascript)
        //createdOnDate: new Date(new Date().toUTCString())
    };

    // TODO: We need to test this here (are the dates in the correct UTC ISO8601 format)
    const result = await query<{ id: number }>(
        "INSERT INTO events (name, created_by_user_id, created_on_date) VALUES ($1, $2, $3) RETURNING id",
        [name, userId, event.createdOnDate]
    );

    event.id = result.rows[0].id;

    return event;
}

export async function deleteEvent(id: number): Promise<void> {
    // TODO: Add a DB contstraint that would do cascade on delete
    await query("DELETE FROM karts WHERE event_id = $1", [id]);
    await query("DELETE FROM pits WHERE event_id = $1", [id]);
    await query("DELETE FROM events WHERE id = $1", [id]);
}

export async function getEvent(id: number): Promise<Event> {
    const result = await query<Event>(
        `SELECT
            id,
            name,
            created_by_user_id AS "createdByUserId",
            created_on_date AS "createdOnDate"
        FROM events
        WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}

export async function getEventCompositesByUserId(userId: number): Promise<EventComposite[]> {
    const result = await query<EventComposite>(
        `SELECT
            e.id,
            e.name,
            (SELECT COUNT(id) FROM karts WHERE event_id = e.id) AS "noOfKartsTotal",
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 2 AND event_id = e.id) AS "noOfKartsInRace",
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 3 AND event_id = e.id) AS "noOfKartsInPit",
            (SELECT COUNT(id) FROM karts WHERE status_type_id = 1 AND event_id = e.id) AS "noOfKartsIdle",
            (SELECT COUNT(id) FROM pits WHERE event_id = e.id) AS "noOfPits",
            created_by_user_id AS "createdByUserId",
            created_on_date AS "createdOnDate"
        FROM events AS e
        WHERE e.created_by_user_id = $1`,
        [userId]
    );

    return result.rows as EventComposite[];
}

export async function getKartsByEventId(eventId: number): Promise<Kart[]> {
    const result = await query<Kart>(
        `SELECT
            k.id,
            k.event_id AS "eventId",
            k.status_type_id AS "statusType",
            k.event_no AS "eventNo",
            k.previous_event_no AS "previousEventNo",
            k.classification_type_id AS "classificationType",
            k.pit_id AS "pitId",
            k.pit_order AS "pitOrder",
            k.markdown_notes AS "markdownNotes",
            p.name AS "pitName",
            p.color_hex AS "pitColorHex"
        FROM karts AS k
        LEFT OUTER JOIN pits AS p ON k.pit_id = p.id
        WHERE k.event_id = $1
        ORDER BY k.event_no, k.id ASC`,
        [eventId]
    );

    return result.rows;
}

export async function getKart(id: string): Promise<Kart> {
    const result = await query<Kart>(
        `SELECT
            k.id,
            k.event_id AS "eventId",
            k.status_type_id AS "statusType",
            k.event_no AS "eventNo",
            k.previous_event_no AS "previousEventNo",
            k.classification_type_id AS "classificationType",
            k.pit_id AS "pitId",
            k.pit_order AS "pitOrder",
            k.markdown_notes AS "markdownNotes",
            p.name AS "pitName",
            p.color_hex AS "pitColorHex"
        FROM karts AS k
        LEFT OUTER JOIN pits AS p ON k.pit_id = p.id
        WHERE k.id = $1`,
        [id]
    );

    return result.rows[0];
}

export async function updateKart(kart: Kart): Promise<void> {
    await query(
        `UPDATE karts SET
            status_type_id = $1,
            event_no = $2,
            previous_event_no = $3,
            classification_type_id = $4,
            pit_id = $5,
            pit_order = $6,
            markdown_notes = $7
        WHERE id = $8`,
        [
            kart.statusType,
            kart.eventNo,
            kart.previousEventNo,
            kart.classificationType,
            kart.pitId,
            kart.pitOrder,
            kart.markdownNotes,
            kart.id
        ]
    );
}

export async function deleteKart(kart: Kart): Promise<void> {
    await query(`DELETE FROM karts WHERE id = $1`, [kart.id]);
}

export async function getMaxPitOrderIdByPitId(pitId: string): Promise<number> {
    const result = await query<{ maxPitOrder: number }>(
        `SELECT
            MAX(pit_order) AS "maxPitOrder"
        FROM karts
        WHERE pit_id = $1`,
        [pitId]
    );

    return result.rows[0].maxPitOrder;
}

export async function resetPitOrdersByPitId(pitId: string): Promise<void> {
    const result = await query<{ id: number }>(
        "SELECT id FROM karts WHERE pit_id = $1 ORDER BY pit_order ASC",
        [pitId]
    );

    // TODO: Optimize this in a single query (some prepared query perhaps?)
    for (let i = 0; i < result.rows.length; i++) {
        await query(`UPDATE karts SET pit_order = $1 WHERE id = $2`, [i + 1.5, result.rows[i].id]);
    }
}

export async function getPitsByEventId(eventId: number): Promise<Pit[]> {
    const result = await query<Pit>(
        `SELECT
            id,
            event_id AS "eventId",
            name,
            color_hex AS "colorHex",
            description
        FROM pits
        WHERE event_id = $1`,
        [eventId]
    );

    return result.rows;
}

export async function getUserByUsername(username: string): Promise<User> {
    const result = await query<User>(
        `SELECT
            id,
            username,
            password,
            display_name AS "displayName"
        FROM users
        WHERE username = $1`,
        [username]
    );

    return result.rows[0];
}

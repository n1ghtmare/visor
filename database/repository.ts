import prisma from "helpers/prisma";

import ClassificationType from "entities/ClassificationType";
import StatusType from "entities/StatusType";
import EventComposite from "entities/EventComposite";
import PitColorMap from "entities/PitColorMap";

import { User, Kart, Pit, Event } from "@prisma/client";

export async function createPits(eventId: number, pitColorMaps: PitColorMap[]): Promise<Pit[]> {
    const pits: Pit[] = [];

    for (let i = 0; i < pitColorMaps.length; i++) {
        const pit: Pit = await prisma.pit.create({
            data: {
                eventId,
                name: pitColorMaps[i].name,
                colorHex: pitColorMaps[i].colorHex
            }
        });

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
        const kart: Kart = await prisma.kart.create({
            data: {
                eventId,
                classificationType: ClassificationType.Normal,
                eventNo: i < noOfStartingKarts ? i + 1 : null,
                statusType: i < noOfStartingKarts ? StatusType.Racing : StatusType.Idle
            }
        });
        karts.push(kart);
    }

    return karts;
}

export async function createEvent(name: string, userId: number): Promise<Event> {
    return await prisma.event.create({
        data: {
            name,
            createdByUserId: userId
        }
    });
}

export async function deleteEvent(id: number): Promise<void> {
    await prisma.event.delete({ where: { id } });
}

export async function getEvent(id: number): Promise<Event> {
    return await prisma.event.findUnique({ where: { id } });
}

export async function getEventCompositesByUserId(userId: number): Promise<EventComposite[]> {
    const results: EventComposite[] = await prisma.$queryRaw<EventComposite[]>`SELECT
            e.id,
            e.name,
            (SELECT COUNT(id) FROM karts WHERE event_id = e.id) AS "noOfKartsTotal",
            (SELECT COUNT(id) FROM karts WHERE status_type = 2 AND event_id = e.id) AS "noOfKartsInRace",
            (SELECT COUNT(id) FROM karts WHERE status_type = 3 AND event_id = e.id) AS "noOfKartsInPit",
            (SELECT COUNT(id) FROM karts WHERE status_type = 1 AND event_id = e.id) AS "noOfKartsIdle",
            (SELECT COUNT(id) FROM pits WHERE event_id = e.id) AS "noOfPits",
            created_by_user_id AS "createdByUserId",
            created_on_date AS "createdOnDate"
        FROM events AS e
        WHERE e.created_by_user_id = ${userId}`;
    return results;
}

export async function getKartsByEventId(eventId: number): Promise<Kart[]> {
    const result = await prisma.kart.findMany({
        where: {
            eventId
        },
        orderBy: [{ eventNo: "asc" }, { id: "asc" }]
    });
    return result;
}

export async function getKart(id: string): Promise<Kart> {
    return await prisma.kart.findUnique({ where: { id } });
}

export async function updateKart(kart: Kart): Promise<void> {
    await prisma.kart.update({
        data: {
            statusType: kart.statusType,
            eventNo: kart.eventNo,
            previousEventNo: kart.previousEventNo,
            classificationType: kart.classificationType,
            pitId: kart.pitId,
            pitOrder: kart.pitOrder,
            markdownNotes: kart.markdownNotes
        },
        where: {
            id: kart.id
        }
    });
}

export async function deleteKart(kart: Kart): Promise<void> {
    await prisma.kart.delete({ where: { id: kart.id } });
}

export async function getMaxPitOrderIdByPitId(pitId: string): Promise<number> {
    const result = await prisma.kart.aggregate({
        where: { pitId },
        _max: { pitOrder: true }
    });
    return result._max.pitOrder;
}

export async function resetPitOrdersByPitId(pitId: string): Promise<void> {
    const result: Kart[] = await prisma.kart.findMany({
        where: { pitId },
        orderBy: { pitOrder: "asc" }
    });

    // TODO: Optimize this in a single query (some prepared query perhaps?)
    for (let i = 0; i < result.length; i++) {
        await prisma.kart.update({ data: { pitOrder: i + 1.5 }, where: { id: result[i].id } });
    }
}

export async function getPitsByEventId(eventId: number): Promise<Pit[]> {
    return await prisma.pit.findMany({ where: { eventId } });
}

export async function getUserByUsername(username: string): Promise<User> {
    return await prisma.user.findUnique({
        where: { username }
    });
}

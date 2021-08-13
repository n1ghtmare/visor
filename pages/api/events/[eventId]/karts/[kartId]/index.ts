import { NextApiResponse } from "next";

import sleep from "helpers/sleep";
import withSession, { NextIronRequest } from "helpers/session";
import { validateRequestAndGetEvent } from "helpers/api";
import {
    getKart,
    getMaxPitOrderIdByPitId,
    resetPitOrdersByPitId,
    updateKart
} from "database/repository";

import Event from "entities/Event";
import Kart from "entities/Kart";
import StatusType from "entities/StatusType";

async function setInitialPitOrderToKartIfNeeded(existingKart: Kart, requestKart: Kart) {
    // We're either moving the kart from another statusType or we're moving from one pit to another, either way we should set the correct pitOrder (max + 1 or 0 + 1.5)
    if (
        (requestKart.statusType === StatusType.Pit && existingKart.statusType !== StatusType.Pit) ||
        (requestKart.statusType === StatusType.Pit &&
            existingKart.statusType === StatusType.Pit &&
            requestKart.pitId !== existingKart.pitId)
    ) {
        const maxPitOrder = await getMaxPitOrderIdByPitId(requestKart.pitId);

        // The order should be 1.5, 2.5, 3.5 etc.
        requestKart.pitOrder = maxPitOrder ? maxPitOrder + 1 : 1.5;
    }

    // Reset the pit order if we're moving the kart *out* of the pit
    if (requestKart.statusType !== StatusType.Pit) {
        requestKart.pitOrder = null;
    }
}

async function handlePitOrderChangesIfNeeded(existingKart: Kart, requestKart: Kart) {
    // If the kart pitOrder doesn't have a fraction that means it was changed by the user
    if (requestKart.pitOrder % 1.0 === 0) {
        await resetPitOrdersByPitId(requestKart.pitId);
    }

    // If the kart was moved from one pit to another, or outside of a pit, then we have to reset the pit orders in the previous pit
    if (
        (requestKart.statusType !== StatusType.Pit && existingKart.statusType === StatusType.Pit) ||
        (existingKart.statusType === StatusType.Pit && requestKart.pitId !== existingKart.pitId)
    ) {
        await resetPitOrdersByPitId(existingKart.pitId);
    }
}

async function handlePut(req: NextIronRequest, res: NextApiResponse) {
    // TODO: Remove before production
    // simulate long working hours
    await sleep(3000);

    const event: Event = await validateRequestAndGetEvent(req, res);

    const { kartId } = req.query;
    const kart: Kart = await getKart(kartId as string);

    // Validate the kart as well - we can't call a kart that doesn't belong to the event (missmatch)
    if (kart.eventId !== event.id) {
        res.status(403).json({ message: "Forbidden" });
    }

    const requestKart = req.body as Kart;

    if (kart.id === requestKart.id) {
        // Assign a new pit order only for karts that are placed in the pit from another status
        await setInitialPitOrderToKartIfNeeded(kart, requestKart);
        await updateKart(requestKart);

        // Make sure all karts are in the correct pit order
        await handlePitOrderChangesIfNeeded(kart, requestKart);
    }

    res.status(200).json({ message: `Success updating kart with id: ${event.id}` });
}

export default withSession(async function handler(req: NextIronRequest, res: NextApiResponse) {
    // DELETE: api/events/[id]/karts/[id]
    if (req.method === "PUT") {
        await handlePut(req, res);
    }
    // no other request types are allowed
    else {
        res.status(405).json({ message: "Method not allowed" });
    }
});

import { Kart } from "@prisma/client";
import StatusType from "entities/StatusType";

export function groupedMapByStatusType(karts: Kart[]): Map<StatusType, Kart[]> {
    const initialMap = new Map<StatusType, Kart[]>();
    initialMap.set(StatusType.Racing, []);
    initialMap.set(StatusType.Idle, []);
    initialMap.set(StatusType.Pit, []);

    return karts.reduce(
        (map: Map<StatusType, Kart[]>, kart) =>
            map.set(kart.statusType, [...(map.get(kart.statusType) || []), kart]),
        initialMap
    );
}

export function groupedMapByPitId(karts: Kart[]): Map<string, Kart[]> {
    const initialMap = new Map<string, Kart[]>();
    return karts.reduce(
        (map: Map<string, Kart[]>, kart) =>
            map.set(kart.pitId, [...(map.get(kart.pitId) || []), kart]),
        initialMap
    );
}

import React from "react";

import { Kart, Pit } from "@prisma/client";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

import KartsTableHeaderIdle from "./KartsTableIdle/KartsTableHeaderIdle";
import KartsTableRowIdle from "./KartsTableIdle/KartsTableRowIdle";

export default function KartsTableIdle({
    karts,
    pits,
    eventNosInUse,
    onEditConfirm,
    onDeleteConfirm
}: {
    karts: Kart[];
    pits: Pit[];
    eventNosInUse: number[];
    onEditConfirm: (kart: Kart) => void;
    onDeleteConfirm: (kart: Kart) => void;
}) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderIdle />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={7}
                        message={
                            "No karts are idle right now. When you move a kart from either the race or the pit into idle, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => (
                        <KartsTableRowIdle
                            key={x.id}
                            kart={x}
                            pits={pits}
                            eventNosInUse={eventNosInUse}
                            onEditConfirm={onEditConfirm}
                            onDeleteConfirm={onDeleteConfirm}
                        />
                    ))
                )}
            </KartsTableBody>
        </KartsTable>
    );
}

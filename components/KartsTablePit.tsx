import { groupedMapByPitId } from "helpers/data";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

import KartsTableHeaderPit from "./KartsTablePit/KartsTableHeaderPit";
import KartsTableRowPit from "./KartsTablePit/KartsTableRowPit";
import PitBadge from "./KartsTablePit/KartsTableRowPit/PitBadge";
import { Kart, Pit } from "@prisma/client";

export default function KartsTablePit({
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
    function renderTableInnerBody() {
        if (karts.length === 0) {
            return (
                <KartsTableEmptyRow
                    colSpan={7}
                    message="No karts are in any of the pits right now. When you move a kart from either racing or idle to the pit, it should appear here"
                />
            );
        }

        const sortedKarts = karts.sort((a, b) => {
            return a.pitOrder - b.pitOrder;
        });

        const grouped = groupedMapByPitId(sortedKarts);

        return pits.map((x) => {
            const filteredKarts: Kart[] = grouped.get(x.id);
            const totalRowsCount = filteredKarts ? filteredKarts.length : 0;

            return [
                <tr key={x.id}>
                    <td colSpan={8} className="bg-gray-50 px-6 py-3">
                        <div className="flex items-center space-x-4">
                            <PitBadge name={x.name} colorHex={x.colorHex} />
                            <span className="font-bold text-gray-500">{totalRowsCount}</span>
                        </div>
                    </td>
                </tr>,
                !filteredKarts ? (
                    <tr key={`no-karts-${x.id}`}>
                        <td colSpan={8} className="px-6 py-2">
                            -
                        </td>
                    </tr>
                ) : (
                    filteredKarts.map((y, i) => (
                        <KartsTableRowPit
                            key={y.id}
                            kart={y}
                            pits={pits}
                            eventNosInUse={eventNosInUse}
                            onEditConfirm={onEditConfirm}
                            onDeleteConfirm={onDeleteConfirm}
                            rowIndex={i}
                            totalRowsCount={totalRowsCount}
                        />
                    ))
                )
            ];
        });
    }

    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderPit />}
            <KartsTableBody>{renderTableInnerBody()}</KartsTableBody>
        </KartsTable>
    );
}

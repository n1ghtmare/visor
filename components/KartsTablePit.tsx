import { groupedMapByPitId } from "helpers/data";

import Kart from "entities/Kart";
import Pit from "entities/Pit";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

import KartsTableHeaderPit from "./KartsTablePit/KartsTableHeaderPit";
import KartsTableRowPit from "./KartsTablePit/KartsTableRowPit";
import PitBadge from "./KartsTablePit/KartsTableRowPit/PitBadge";

// TODO: Add a last status change date, so that the user can determine when a kart has entered the pit
// TODO: Add separate tables for each pit
// TODO: Add a "Pit No" that can be sorted and where pits can switch places
// TODO: Add an option to switch pit orders for karts in pits (arrow buttons for up and down)
export default function KartsTablePit({
    karts,
    pits,
    eventNosInUse,
    onEditConfirm
}: {
    karts: Kart[];
    pits: Pit[];
    eventNosInUse: number[];
    onEditConfirm: (kart: Kart) => void;
}) {
    function handleEditConfirm(kart: Kart) {
        //TODO: Handle re-ordering here

        onEditConfirm(kart);
    }

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

            return [
                <tr key={x.id}>
                    <td colSpan={7} className="px-6 py-3 bg-gray-50">
                        <div className="flex items-center space-x-4">
                            <PitBadge name={x.name} colorHex={x.colorHex} />
                            <span className="font-bold text-gray-500"> {filteredKarts.length}</span>
                        </div>
                    </td>
                </tr>,
                !filteredKarts ? (
                    <tr key={`no-karts-${x.id}`}>
                        <td colSpan={7} className="px-6 py-2">
                            -
                        </td>
                    </tr>
                ) : (
                    filteredKarts.map((y) => (
                        <KartsTableRowPit
                            key={y.id}
                            kart={y}
                            pits={pits}
                            eventNosInUse={eventNosInUse}
                            onEditConfirm={handleEditConfirm}
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

import Kart from "entities/Kart";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

import KartsTableHeaderPit from "./KartsTablePit/KartsTableHeaderPit";
import KartsTableRowPit from "./KartsTablePit/KartsTableRowPit";

export default function KartsTablePit({
    karts,
    eventNosInUse,
    onEditConfirm
}: {
    karts: Kart[];
    eventNosInUse: number[];
    onEditConfirm: (kart: Kart) => void;
}) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderPit />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={7}
                        message={
                            "No karts are in a pit lane right now, when you move a kart into a pit, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => (
                        <KartsTableRowPit
                            key={x.id}
                            kart={x}
                            eventNosInUse={eventNosInUse}
                            onEditConfirm={(kart) => onEditConfirm(kart)}
                        />
                    ))
                )}
            </KartsTableBody>
        </KartsTable>
    );
}

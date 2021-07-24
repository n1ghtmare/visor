import Kart from "entities/Kart";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

import KartsTableHeaderRacing from "./KartsTableRacing/KartsTableHeaderRacing";
import KartsTableRowRacing from "./KartsTableRacing/KartsTableRowRacing";

export default function KartsTableRacing({
    karts,
    onEditConfirm
}: {
    karts: Kart[];
    onEditConfirm: (kart: Kart) => void;
}) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderRacing />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={7}
                        message={
                            "No karts are racing right now. When you move a kart from either a pit or from being idle, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => (
                        <KartsTableRowRacing key={x.id} kart={x} onEditConfirm={onEditConfirm} />
                    ))
                )}
            </KartsTableBody>
        </KartsTable>
    );
}

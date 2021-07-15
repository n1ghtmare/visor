import Kart from "entities/Kart";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

function KartsTableRowIdle({ kart }: { kart: Kart }) {
    return (
        <tr className="hover:bg-blue-50 hover:cursor-pointer">
            <td className="px-6 py-3 font-medium text-left">{kart.id}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.previousEventNo}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.classificationType}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.markdownNotes}</td>
        </tr>
    );
}

function KartsTableHeaderIdle() {
    return (
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Id
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Previous Event No
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Classification
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Notes
                </th>
            </tr>
        </thead>
    );
}

export default function KartsTableIdle({ karts }: { karts: Kart[] }) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderIdle />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={4}
                        message={
                            "No karts are idle right now. When you move a kart from either the race or the box into idle, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => <KartsTableRowIdle key={x.id} kart={x} />)
                )}
            </KartsTableBody>
        </KartsTable>
    );
}

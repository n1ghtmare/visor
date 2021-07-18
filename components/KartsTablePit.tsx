import Kart from "entities/Kart";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

function KartsTableRowPit({ kart }: { kart: Kart }) {
    return (
        <tr className="hover:bg-blue-50 hover:cursor-pointer">
            <td className="px-6 py-3 font-medium text-left">{kart.id}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.pitId}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.previousEventNo}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.classificationType}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.markdownNotes}</td>
        </tr>
    );
}

function KartsTableHeaderPit() {
    return (
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Id
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Pit Id
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

export default function KartsTablePit({ karts }: { karts: Kart[] }) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderPit />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={5}
                        message={
                            "No karts are in a pit lane right now, when you move a kart into a pit, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => <KartsTableRowPit key={x.id} kart={x} />)
                )}
            </KartsTableBody>
        </KartsTable>
    );
}

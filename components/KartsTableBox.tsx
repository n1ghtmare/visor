import Kart from "entities/Kart";

import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

function KartsTableRowBox({ kart }: { kart: Kart }) {
    return (
        <tr className="hover:bg-blue-50 hover:cursor-pointer">
            <td className="px-6 py-3 font-medium text-left">{kart.id}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.boxId}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.previousEventNo}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.classificationType}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.markdownNotes}</td>
        </tr>
    );
}

function KartsTableHeaderBox() {
    return (
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Id
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Box Id
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

export default function KartsTableBox({ karts }: { karts: Kart[] }) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderBox />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={5}
                        message={
                            "No karts are in box right now, when you move a kart into a box, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => <KartsTableRowBox key={x.id} kart={x} />)
                )}
            </KartsTableBody>
        </KartsTable>
    );
}

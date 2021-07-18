import Kart from "entities/Kart";

import IconCog from "./Shared/IconCog";
import KartsTable from "./Shared/KartsTable";
import KartsTableBody from "./Shared/KartsTableBody";
import KartsTableEmptyRow from "./Shared/KartsTableEmptyRow";

function KartsTableRowRacing({ kart }: { kart: Kart }) {
    return (
        <tr className="hover:bg-blue-50 hover:cursor-pointer">
            <td className="px-6 py-3 font-medium text-left">{kart.id}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.eventNo}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">
                {kart.previousEventNo || "-"}
            </td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.classificationType}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{kart.markdownNotes || "-"}</td>
            <td className="px-6 py-4 font-medium text-right whitespace-nowrap">
                <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => console.log("Will edit here")}
                >
                    <IconCog />
                </button>
            </td>
        </tr>
    );
}

function KartsTableHeaderRacing() {
    return (
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Id
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase whitespace-nowrap">
                    Event No
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase whitespace-nowrap">
                    Previous Event No
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase whitespace-nowrap">
                    Classification
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase whitespace-nowrap">
                    Notes
                </th>
                <th className="relative px-6 py-4">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
    );
}

export default function KartsTableRacing({ karts }: { karts: Kart[] }) {
    return (
        <KartsTable>
            {karts.length > 0 && <KartsTableHeaderRacing />}
            <KartsTableBody>
                {karts.length === 0 ? (
                    <KartsTableEmptyRow
                        colSpan={6}
                        message={
                            "No karts are racing right now. When you move a kart from either a pit or from being idle, it should appear here."
                        }
                    />
                ) : (
                    karts.map((x) => <KartsTableRowRacing key={x.id} kart={x} />)
                )}
            </KartsTableBody>
        </KartsTable>
    );
}
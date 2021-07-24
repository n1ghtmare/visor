export default function KartsTableHeaderPit() {
    return (
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Id
                </th>
                <th className="w-40 px-6 py-4 text-xs font-medium tracking-wider text-center text-gray-500 uppercase whitespace-nowrap">
                    Pit
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase w-44 whitespace-nowrap">
                    Previous Event No
                </th>
                <th className="w-40 px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Classification
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase whitespace-nowrap">
                    Notes
                </th>
                <th className="w-20">
                    <span className="sr-only">Edit</span>
                </th>
                <th className="w-20">
                    <span className="sr-only">Change Status</span>
                </th>
            </tr>
        </thead>
    );
}
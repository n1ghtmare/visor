export default function EventsTableEmptyRow() {
    return (
        <tr>
            <td colSpan={8} className="px-6 py-8">
                Looks like there are no events created yet. Start by creating your fist one.
            </td>
        </tr>
    );
}

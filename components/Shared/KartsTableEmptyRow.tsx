export default function KartsTableEmptyRow({
    colSpan,
    message
}: {
    colSpan: number;
    message: string;
}) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-6 py-8">
                {message}
            </td>
        </tr>
    );
}

import IconPlusCircle from "components/Shared/IconPlusCircle";
import LinkButton from "components/Shared/LinkButton";

export default function EventsTableFooter() {
    return (
        <tfoot className="bg-gray-50">
            <tr>
                <td colSpan={8} className="px-6 py-3">
                    <LinkButton href="/event/create">
                        <IconPlusCircle />
                        <span>Create Event</span>
                    </LinkButton>
                </td>
            </tr>
        </tfoot>
    );
}

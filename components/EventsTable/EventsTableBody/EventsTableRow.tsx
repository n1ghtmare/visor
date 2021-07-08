import IconTrash from "components/Shared/IconTrash";
import { generateTimestampText } from "helpers/timestamp";

export default function EventsTableRow(props: {
    name: string;
    noOfKartsTotal: number;
    noOfKartsInRace: number;
    noOfKartsInBox: number;
    noOfKartsIdle: number;
    noOfBoxes: number;
    createdOnDate: Date;
}) {
    return (
        <tr className="hover:bg-blue-50 hover:cursor-pointer">
            <td className="px-6 py-3 font-medium text-left">
                <a href="#" className="text-blue-600 hover:text-blue-900">
                    {props.name}
                </a>
            </td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{props.noOfKartsTotal}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{props.noOfKartsInRace}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{props.noOfKartsInBox}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{props.noOfKartsIdle}</td>
            <td className="px-6 py-4 text-center whitespace-nowrap">{props.noOfBoxes}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                {generateTimestampText(props.createdOnDate)}
            </td>
            <td className="px-6 py-4 font-medium text-right whitespace-nowrap">
                <a href="#" className="text-red-600 hover:text-red-900">
                    <IconTrash />
                </a>
            </td>
        </tr>
    );
}

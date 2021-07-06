import ClassificationType from "./ClassificationType";
import StatusType from "./StatusType";

type Kart = {
    id: string;
    eventId: number;
    statusType: StatusType;
    eventNo?: number;
    previousEventNo?: number;
    classificationType: ClassificationType;
    boxId?: string;
    markdownNotes?: string;
};

export default Kart;

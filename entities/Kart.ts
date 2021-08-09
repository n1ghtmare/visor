import ClassificationType from "./ClassificationType";
import StatusType from "./StatusType";

type Kart = {
    id: string;
    eventId: number;
    statusType: StatusType;
    eventNo?: number;
    previousEventNo?: number;
    classificationType: ClassificationType;
    pitId?: string;
    pitOrder?: number;
    markdownNotes?: string;
    // Aux read-only columns (returned from a join)
    pitName?: string;
    pitColorHex?: string;
};

export default Kart;

import ClassificationType from "./ClassificationType";
import StatusType from "./StatusType";

type Kart = {
    id: string;
    raceId: number;
    statusType: StatusType;
    raceNo?: number;
    previousRaceNo?: number;
    classificationType: ClassificationType;
    boxId?: string;
    markdownNotes?: string;
};

export default Kart;

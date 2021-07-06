type EventSummary = {
    id: number;
    name: string;
    noOfKartsTotal: number;
    noOfKartsInRace: number;
    noOfKartsInBox: number;
    noOfKartsIdle: number;
    noOfBoxes: number;
    createdByUserId: number;
    createdOnDate: Date;
};

export default EventSummary;

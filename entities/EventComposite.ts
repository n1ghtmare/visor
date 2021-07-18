type EventComposite = {
    id: number;
    name: string;
    noOfKartsTotal: number;
    noOfKartsInRace: number;
    noOfKartsInPit: number;
    noOfKartsIdle: number;
    noOfPits: number;
    createdByUserId: number;
    createdOnDate: Date;
};

export default EventComposite;

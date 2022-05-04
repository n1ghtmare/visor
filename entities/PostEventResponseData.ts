import { Kart, Pit, Event } from "@prisma/client";

type PostEventResponseData = {
    event: Event;
    pits: Pit[];
    karts: Kart[];
};

export default PostEventResponseData;

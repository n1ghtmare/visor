import Pit from "./Pit";
import Kart from "./Kart";
import Event from "./Event";

type PostEventResponseData = {
    event: Event;
    pits: Pit[];
    karts: Kart[];
};

export default PostEventResponseData;

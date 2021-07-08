import Box from "./Box";
import Kart from "./Kart";
import Event from "./Event";

type PostEventResponseData = {
    event: Event;
    boxes: Box[];
    karts: Kart[];
};

export default PostEventResponseData;

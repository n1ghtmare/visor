import Box from "./Box";
import Kart from "./Kart";
import Event from "./Event";

type CreateEventResponseData = {
    event: Event;
    boxes: Box[];
    karts: Kart[];
};

export default CreateEventResponseData;

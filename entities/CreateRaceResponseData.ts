import Box from "./Box";
import Kart from "./Kart";
import Race from "./Race";

type CreateRaceResponseData = {
    race: Race;
    boxes: Box[];
    karts: Kart[];
};

export default CreateRaceResponseData;

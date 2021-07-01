import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    noOfTotalKarts: number;
    noOfStartingKarts: number;
    noOfBoxes: number;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = req.body as Data;

    console.log({ data });
    // TODO: Create entries in a database
    res.status(200).json({ message: "hello there" });
}

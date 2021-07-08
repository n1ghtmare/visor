import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { eventId } = req.query;

    console.log({ eventId });

    if (req.method === "GET") {
        res.status(200).json({ message: "Everything is a ok" });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

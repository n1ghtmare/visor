// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";

export type NextIronRequest = NextApiRequest & { session: Session };
export type NextIronHandler = (req: NextIronRequest, res: NextApiResponse) => void | Promise<void>;

const withSession = (handler: NextIronHandler) => {
    return withIronSession(handler, {
        // TODO: Store the cookie password in an environment variable/secret not in the git repo
        password: "5DBsxzN8z7PWeAbC8G0GX09YK6WyJ5773fKzVep0vBq3AbkiRcEY5y1",
        cookieName: "visor-iron-session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production"
        }
    });
};

export default withSession;

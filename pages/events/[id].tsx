import { NextRouter, useRouter } from "next/router";

export default function Event() {
    const router: NextRouter = useRouter();
    const { id } = router.query;

    return <div>This is the page for a single event</div>;
}

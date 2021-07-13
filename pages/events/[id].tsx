import { useKarts } from "hooks/KartHooks";
import { NextRouter, useRouter } from "next/router";

export default function Event() {
    const router: NextRouter = useRouter();
    const { id } = router.query;
    const eventId = parseInt(id as string, 10);

    if (isNaN(eventId)) {
        // TODO: Do we need to check this?
    }

    const { karts, isLoading, isError, isValidating } = useKarts(eventId);

    return <div>This is the page for a single event</div>;
}

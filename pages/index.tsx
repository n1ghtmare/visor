import IconArrowNarrowRight from "components/Shared/IconArrowNarrowRight";
import LinkButton from "components/Shared/LinkButton";
import Layout from "components/Shared/Layout";

export default function Home() {
    return (
        <Layout pageTitle="Visor" shouldDisplayHeader={false}>
            <main className="text-center">
                <h1 className="text-6xl font-bold">Welcome to Visor</h1>

                <p className="mt-3 text-2xl">
                    This is the place where you can setup and track racing events.
                </p>

                <div className="mt-12">
                    <LinkButton href="/events">
                        <IconArrowNarrowRight />
                        <span>View Events</span>
                    </LinkButton>
                </div>
            </main>
        </Layout>
    );
}

import Spinner from "./Spinner";

export default function LoadingIndicatorFlat() {
    return (
        <div className="flex flex-col items-center py-6 space-y-4">
            <div>Loading data, please wait...</div>
            <Spinner />
        </div>
    );
}

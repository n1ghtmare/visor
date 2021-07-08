import Spinner from "./Spinner";

export default function RefetchingIndicator() {
    return (
        <div className="fixed bottom-0 left-0 right-0 mb-4">
            <div className="flex justify-center">
                <div className="flex items-center justify-center w-auto px-6 py-3 bg-white rounded shadow">
                    <Spinner />
                    <span>Fetching data...</span>
                </div>
            </div>
        </div>
    );
}

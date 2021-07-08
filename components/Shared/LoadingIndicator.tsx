import Spinner from "./Spinner";

export default function LoadingIndicator() {
    return (
        <div className="flex justify-center">
            <div className="bg-white flex flex-col items-center px-12 py-6 shadow border rounded overflow-hidden space-y-4">
                <div>
                    <Spinner />
                </div>
                <div className="">Loading data, please wait...</div>
            </div>
        </div>
    );
}

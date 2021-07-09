export default function Button(
    props: React.PropsWithChildren<{
        title?: string;
        isDisabled?: boolean;
        type?: "button" | "submit" | "reset";
        onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }>
) {
    return (
        <button
            type={props.type}
            title={props.title}
            className={`flex items-center px-4 py-2 font-bold text-white bg-blue-600 border border-blue-600 rounded space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                props.isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700 hover:border-blue-700"
            }`}
            disabled={props.isDisabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

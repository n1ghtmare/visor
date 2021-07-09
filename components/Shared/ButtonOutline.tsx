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
            className={`flex items-center px-4 py-2 font-bold bg-white border border-current rounded space-x-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                props.isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-700"
            }`}
            disabled={props.isDisabled}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

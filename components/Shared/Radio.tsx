export default function Radio(props: {
    name: string;
    value: string;
    labelText: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <label className="inline-flex items-center flex-1 font-bold space-x-3">
            <input
                type="radio"
                name={props.name}
                className="border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 focus:outline-none"
                value={props.value}
                checked={props.checked}
                onChange={props.onChange}
            />
            <span>{props.labelText}</span>
        </label>
    );
}

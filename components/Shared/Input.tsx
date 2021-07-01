import React from "react";

type InputProps = {
    name?: string;
    id?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    isInvalid?: boolean;
    type?: string;
    autoComplete?: string;
    value?: string;
    placeholder?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return (
        <input
            ref={ref}
            value={props.value}
            type={props.type}
            id={props.id}
            name={props.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
            autoComplete={props.autoComplete}
            placeholder={props.placeholder}
            className={`w-full px-4 py-2 bg-white border rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                props.isInvalid
                    ? "border-red-500 focus:ring-red-500 placeholder-red-400"
                    : "focus:ring-blue-600 placeholder-gray-400"
            }`}
        />
    );
});

Input.displayName = "Input";

export default Input;

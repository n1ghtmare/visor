import React from "react";

type TextAreaProps = {
    name?: string;
    id?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    isInvalid?: boolean;
    value?: string;
    disabled?: boolean;
};

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
    return (
        <textarea
            ref={ref}
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onChange={props.onChange}
            onBlur={props.onBlur}
            className={`w-full placeholder-gray-400 border rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                props.isInvalid
                    ? "border-red-500 focus:ring-red-500 placeholder-red-400"
                    : "focus:ring-blue-600 placeholder-gray-400 border-gray-300"
            }`}
        />
    );
});

TextArea.displayName = "TextArea";

export default TextArea;

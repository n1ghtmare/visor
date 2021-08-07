import { useEffect, useState } from "react";

export function useEscCancel(handler: () => void) {
    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handler();
            }
        };
        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [handler]);
}

// Detect a click that is outside of the refs passed to the hook and execute the callback (used for dropdowns and modals)
export function useOutsideRefsClick(
    refs: React.MutableRefObject<HTMLElement>[],
    handler: () => void
) {
    useEffect(() => {
        function listener(e: Event) {
            const filteredRefs = refs.filter(
                (x) => !x.current || x.current.contains(e.target as Node)
            );

            if (filteredRefs.length === 0) {
                handler();
            }
        }

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [refs, handler]);
}

export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

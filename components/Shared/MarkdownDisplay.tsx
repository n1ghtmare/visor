import React from "react";
import ReactMarkdown from "react-markdown";

// TODO: Finish the implementation of this and use React.memo()
function MarkdownDisplayCore({ content }: { content: string }) {
    return <ReactMarkdown>{content}</ReactMarkdown>;
}

const MarkdownDisplay = React.memo(MarkdownDisplayCore);

export default MarkdownDisplay;

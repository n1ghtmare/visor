import ReactMarkdown from "react-markdown";

// TODO: Finish the implementation of this and use React.memo()
function MarkdownDisplay({ content }: { content: string }) {
    return <ReactMarkdown>{content}</ReactMarkdown>;
}

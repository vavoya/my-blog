import {HeadingBlockNode} from "md-ast-parser";
import InlineNodes from "@/components/reactMarkdown/inlineNode/InlineNode";


type HeadingBlockProps = {
    node: HeadingBlockNode
}
export default function HeadingBlock({ node }: HeadingBlockProps) {
    const content = node.children.length === 0 ? (
        <br/>
    ) : (
        <InlineNodes nodeArray={node.children} />
    )

    if (node.level === 1) {
        return (
            <h1>
                {content}
            </h1>
        )
    } else if (node.level === 2) {
        return (
            <h2>
                {content}
            </h2>
        )
    } else if (node.level === 3) {
        return (
            <h3>
                {content}
            </h3>
        )
    }

    return (
        <p>
            {content}
        </p>
    )
}
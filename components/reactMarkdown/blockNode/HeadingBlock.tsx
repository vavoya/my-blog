import {HeadingBlockNode} from "md-ast-parser";
import InlineNodes from "@/components/reactMarkdown/inlineNode/InlineNode";


type HeadingBlockProps = {
    node: HeadingBlockNode
}
export default function HeadingBlock({ node }: HeadingBlockProps) {
    if (node.level === 1) {
        return (
            <h1>
                <InlineNodes nodeArray={node.children}/>
            </h1>
        )
    } else if (node.level === 2) {
        return (
            <h2>
                <InlineNodes nodeArray={node.children}/>
            </h2>
        )
    } else if (node.level === 3) {
        return (
            <h3>
                <InlineNodes nodeArray={node.children}/>
            </h3>
        )
    }

    return (
        <p>
            <InlineNodes nodeArray={node.children}/>
        </p>
    )
}
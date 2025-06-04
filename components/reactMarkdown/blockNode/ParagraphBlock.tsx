import {ParagraphBlockNode} from "md-ast-parser";
import InlineNodes from "@/components/reactMarkdown/inlineNode/InlineNode";


type ParagraphBlockProps = {
    node: ParagraphBlockNode
}
export default function ParagraphBlock({ node }: ParagraphBlockProps) {

    return (
        <p>
            <InlineNodes nodeArray={node.children}/>
        </p>
    )
}
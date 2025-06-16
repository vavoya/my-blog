


import {BlockquoteBlockNode} from "md-ast-parser";
import {renderBlockNode} from "@/components/react-markdown/block-node/renderBlockNode";


type BlockquoteBlockProps = {
    node: BlockquoteBlockNode
}
export default function BlockquoteBlock({ node }: BlockquoteBlockProps) {

    return (
        <blockquote>
            {
                node.children.map((block, index) => renderBlockNode(block, index))
            }
        </blockquote>
    )
}
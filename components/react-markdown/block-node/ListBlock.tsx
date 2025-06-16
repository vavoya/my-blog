import {ListBlockNode} from "md-ast-parser";
import {renderBlockNode} from "@/components/react-markdown/block-node/renderBlockNode";


type ListBlockProps = {
    node: ListBlockNode
}
export default function ListBlock({ node }: ListBlockProps) {

    const content = node.children.map((item, index) => {
        return (
            <li key={index}>
                {item.children.map((block, index) => renderBlockNode(block, index))}
            </li>
        )
    })

    if (node.isOrdered) {
        return (
            <ol>
                {content}
            </ol>
        )
    } else {
        return (
            <ul>
                {content}
            </ul>
        )
    }

}
import {Inline} from "md-ast-parser";
import Image from "next/image";


type InlineNodeProps = {
    nodeArray: Inline[]
}
export default function InlineNodes({ nodeArray }: InlineNodeProps) {

    return nodeArray.map((node, index) => {
        if (node.type === "span") {
            return <span key={index} className={node.className}>{node.text}</span>
        } else if (node.type === "link") {
            return (
                <a href={node.href} key={index}>
                    <InlineNodes nodeArray={node.children}/>
                </a>
            )
        } else if (node.type === "img") {
            return (
                <Image key={index} alt={node.alt} src={node.src} />
            )
        } else {
            return null;
        }
    })
}
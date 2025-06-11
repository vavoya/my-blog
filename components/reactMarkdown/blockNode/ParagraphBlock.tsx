import {ParagraphBlockNode} from "md-ast-parser";
import InlineNodes from "@/components/reactMarkdown/inlineNode/InlineNode";
import ReactPlayer from "react-player/lazy";
import ClientOnly from "@/components/ClientOnly";


type ParagraphBlockProps = {
    node: ParagraphBlockNode
}
export default function ParagraphBlock({ node }: ParagraphBlockProps) {
    if (node.children.length === 1 && node.children[0].type === "link" && ReactPlayer.canPlay(node.children[0].href)) {
        return (
            <ClientOnly>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <ReactPlayer
                        url={node.children[0].href}
                        controls={true}
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                </div>
            </ClientOnly>
        )
    }


    return (
        <p>
            {
                node.children.length === 0 ? (
                    <br/>
                ) : (
                    <InlineNodes nodeArray={node.children} />
                )
            }
        </p>
    )
}
import {HeadingBlockNode} from "md-ast-parser";
import InlineNodes from "@/components/react-markdown/inline-node/InlineNode";
import ReactPlayer from "react-player/lazy";
import ClientOnly from "@/components/ClientOnly";


type HeadingBlockProps = {
    node: HeadingBlockNode
}
export default function HeadingBlock({ node }: HeadingBlockProps) {
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
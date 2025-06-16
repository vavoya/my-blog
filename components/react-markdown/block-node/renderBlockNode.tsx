import {BlockNode} from "md-ast-parser";
import HeadingBlock from "@/components/react-markdown/block-node/HeadingBlock";
import ParagraphBlock from "@/components/react-markdown/block-node/ParagraphBlock";
import BlockquoteBlock from "@/components/react-markdown/block-node/BlockquoteBlock";
import ThematicBreakBlock from "@/components/react-markdown/block-node/ThematicBreakBlock";
import CodeBlock from "@/components/react-markdown/block-node/CodeBlock";
import ListBlock from "@/components/react-markdown/block-node/ListBlock";




export const renderBlockNode = (node: BlockNode, key: number) => {
    switch (node.type) {
        case "heading":
            return <HeadingBlock key={key} node={node}/>;
        case "paragraph":
            return <ParagraphBlock key={key} node={node} />;
        case "blockquote":
            return <BlockquoteBlock key={key} node={node}/>;
        case "thematicBreakBlock":
            return <ThematicBreakBlock key={key} node={node}/>;
        case "codeBlock":
            return <CodeBlock key={key} node={node}/>;
        case "list":
            return <ListBlock key={key} node={node}/>;
        default:
            return null;
    }

}
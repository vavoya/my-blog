import {BlockNode} from "md-ast-parser";
import HeadingBlock from "@/components/reactMarkdown/blockNode/HeadingBlock";
import ParagraphBlock from "@/components/reactMarkdown/blockNode/ParagraphBlock";
import BlockquoteBlock from "@/components/reactMarkdown/blockNode/BlockquoteBlock";
import ThematicBreakBlock from "@/components/reactMarkdown/blockNode/ThematicBreakBlock";
import CodeBlock from "@/components/reactMarkdown/blockNode/CodeBlock";
import ListBlock from "@/components/reactMarkdown/blockNode/ListBlock";




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
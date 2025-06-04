import {CodeBlockNode} from "md-ast-parser";
import {Fragment} from "react";


type CodeBlockProps = {
    node: CodeBlockNode
}
export default function CodeBlock({ node }: CodeBlockProps) {

    return (
        <pre>
            <code>
                {
                    node.children.map((line, index) => {
                        return (
                            <Fragment key={index}>
                                {
                                    line.map((code, index) => {
                                        return <span key={index} style={{color: code.color}}>{code.text}</span>
                                    })
                                }
                                <span>{'\n'}</span>
                            </Fragment>
                        )
                    })
                }
            </code>
        </pre>
    )
}
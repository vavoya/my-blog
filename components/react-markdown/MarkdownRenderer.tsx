'use client'

// components/MarkdownRenderer.tsx
import React, {useEffect} from 'react'
import {shikiPromise, parseBlocks, RootBlockNode} from "md-ast-parser"


import 'highlight.js/styles/atom-one-dark.css'
import 'github-markdown-css/github-markdown.css'
import {renderBlockNode} from "@/components/react-markdown/block-node/renderBlockNode";

type MarkdownRendererProps = {
    markdown: string
}
export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {


    useEffect(() => {
        shikiPromise.then()
    }, [])

    const ast = parseBlocks(markdown.split('\n'))

    return (
        <section className="markdown-body" style={{ padding: '1rem' }}>
            {
                ast.children.map((block, index) => renderBlockNode(block, index))
            }
        </section>
    )
}

export function AstRenderer({ ast }: { ast: RootBlockNode }) {
    return (
        <section className="markdown-body" style={{ padding: '1rem' }}>
            {
                ast.children.map((block, index) => renderBlockNode(block, index))
            }
        </section>
    )
}
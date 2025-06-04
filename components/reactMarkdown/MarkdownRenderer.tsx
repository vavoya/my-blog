'use client'

// components/MarkdownRenderer.tsx
import React, {useEffect} from 'react'
import {shikiPromise, parseBlocks, RootBlockNode} from "md-ast-parser"


import 'highlight.js/styles/atom-one-dark.css'
import 'github-markdown-css/github-markdown.css'
import {renderBlockNode} from "@/components/reactMarkdown/blockNode/renderBlockNode";

type MarkdownRendererProps = {
    markdown: string
}
export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {


    useEffect(() => {
        shikiPromise.then()
    }, [])

    const ast = parseBlocks(markdown.split('\n'))

    return (
        <article className="markdown-body" style={{ padding: '1rem' }}>
            {
                ast.children.map((block, index) => renderBlockNode(block, index))
            }
        </article>
    )
}

export function AstRenderer({ ast }: { ast: RootBlockNode }) {
    return (
        <article className="markdown-body" style={{ padding: '1rem' }}>
            {
                ast.children.map((block, index) => renderBlockNode(block, index))
            }
        </article>
    )
}




/*
<ReactMarkdown
                remarkPlugins={[remarkGfm, remarkToc]}
                rehypePlugins={[
                    rehypeRaw,
                    [
                        rehypeSanitize,
                        {
                            ...defaultSchema,
                            tagNames: [
                                ...(defaultSchema.tagNames || []),
                                'table',
                                'thead',
                                'tbody',
                                'tr',
                                'th',
                                'td',
                                'blockquote',
                                'img',
                                'iframe',
                            ],
                            attributes: {
                                ...defaultSchema.attributes,
                                '*': ['className', 'style', 'align'],
                                a: ['href', 'target', 'rel'],
                                img: ['src', 'alt', 'title', 'width', 'height'],
                                code: ['className'],
                            },
                        },
                    ],
                    rehypeHighlight,
                ]}
            >
                {markdown}
            </ReactMarkdown>
 */

/*
// lib/markdownToHtml.ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

export async function markdownToHtml(markdown: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkToc)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize, {
            ...defaultSchema,
            tagNames: [
                ...(defaultSchema.tagNames || []),
                'table',
                'thead',
                'tbody',
                'tr',
                'th',
                'td',
                'blockquote',
                'img',
                'iframe',
            ],
            attributes: {
                ...defaultSchema.attributes,
                '*': ['className', 'style', 'align'],
                a: ['href', 'target', 'rel'],
                img: ['src', 'alt', 'title', 'width', 'height'],
                code: ['className'],
            },
        })
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(markdown)

    return String(file)
}

 */

import Image from "next/image";
import styles from "./page.module.scss";

import Header from "@/app/[blog]/_component/Header";
import React from "react";
import RootSideBar from "@/components/sideBar/RootSideBar";
import 'github-markdown-css/github-markdown.css'
import Link from "next/link";

export default async function Home() {
    return (
        <div>
            <Header />
            <RootSideBar />
            <main className={styles.main}>
                <section className={styles.section}>
                    <h1>sim-log에 오신 것을 환영합니다.</h1>

                    <p>
                        sim-log는 글을 쓰고 관리하는 모든 과정에서 최고의 효율성과 자유로움을 목표로 설계된 블로그 플랫폼입니다.
                        <br/>
                        <br/>
                        단순히 개인적인 기록 공간을 넘어서, 폴더와 시리즈 개념을 도입하여 콘텐츠를 보다 효과적으로 분류하고 운영할 수 있도록 지원합니다.
                    </p>

                    <h2>폴더와 시리즈를 활용한 콘텐츠 관리</h2>
                    <p>
                        포스트가 늘어날수록 블로그 운영에서 가장 큰 고민은 콘텐츠 관리와 정리일 것입니다.
                        <br/>
                        <br/>
                        sim-log는 폴더 기반의 콘텐츠 분류 시스템을 제공합니다. 각 포스트를 주제나 프로젝트 별로 폴더에 담아 명확하게 구분할 수 있습니다.
                    </p>

                    <Image
                        src="/1.png"
                        alt="dd"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                            width: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '4rem',
                            objectFit: 'contain',
                        }}
                    />

                    <p>
                        시리즈 기능을 이용하면 관련된 여러 글을 자연스럽게 이어 연재물이나 체계적인 자료로 관리할 수 있습니다.
                    </p>
                    <Image
                        src="/2.png"
                        alt="dd"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                            width: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '4rem',
                            objectFit: 'contain',
                        }}
                    />
                    <p>
                        이 기능을 통해 방문자 역시 원하는 콘텐츠를 더 쉽고 빠르게 탐색할 수 있습니다.
                    </p>

                    <h2>멀티태스킹을 위한 윈도우 기반 작업 환경</h2>
                    <p>
                        sim-log의 가장 큰 특징 중 하나는 마치 PC의 데스크탑처럼 여러 작업 창을 동시에 띄우고, 자유롭게 작업할 수 있는 환경을 제공한다는 점입니다.
                    </p>
                    <Image
                        src="/3.png"
                        alt="dd"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                            width: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '4rem',
                            objectFit: 'contain',
                        }}
                    />

                    <h2>간편하고 빠른 글 작성 환경</h2>
                    <p>
                        sim-log는 마크다운 문법 기반의 빠르고 간편한 에디터를 제공합니다. 글을 쓰는 데 복잡한 과정이나 불필요한 도구로 고민하지 않아도 됩니다.
                        <br/>
                        <br/>
                        마크다운 문법을 사용하면 직관적이고 빠르게 글을 작성하고, 즉시 결과물을 확인할 수 있습니다.
                    </p>
                    <Image
                        src="/4.png"
                        alt="dd"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                            width: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '4rem',
                            objectFit: 'contain',
                        }}
                    />

                    <h2>콘텐츠 운영을 위한 최적의 경험</h2>
                    <p>
                        sim-log는 포스트 작성과 관리 과정에서 생기는 복잡성과 번거로움을 최소화하고, 운영자가 콘텐츠 관리 자체에 집중할 수 있도록 디자인되었습니다.
                        <br/>
                        <br/>
                    </p>
                    <p>
                        자유로운 배치와 크기 조절이 가능한 창 기반 인터페이스를 통해 sim-log는 단순한 글쓰기가 아닌, 운영자가 콘텐츠 관리에 진정으로 몰입할 수 있는 효율적인 환경을 제공합니다.
                    </p>

                    <h2>앞으로의 sim-log</h2>
                    <p>
                        현재 sim-log는 1인 개발로 운영되고 있습니다.
                        <br/>
                        <br/>
                        당장 많은 기능을 추가하기는 어렵지만, 앞으로 더 많은 사용자들이 sim-log를 찾고 사용하게 된다면 더 편리하고 강력한 기능들을 추가할 계획입니다.
                    </p>
                </section>
                <Link className={styles.button} href="/management">
                    <span>
                        시작하기
                    </span>
                </Link>
            </main>
        </div>
    )
}

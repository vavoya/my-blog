
import Image from "next/image";
import styles from "./page.module.css";
import {auth} from "@/auth";
import getBySession from "@/fetch/server/userInfo/getBySession";
import {redirect} from "next/navigation";
import Header from "@/app/[blog]/_component/Header";
import React from "react";
import RootSideBar from "@/components/sideBar/RootSideBar";

export default async function Home() {

    return (
        <div>
            <Header />
            <RootSideBar />
            <main>
                <h1>ddd</h1>
            </main>
        </div>
    )
}

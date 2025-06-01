import React from "react";
import Header from "@/app/[blog]/_component/Header";
import {SessionProvider} from "next-auth/react";


export default async function Layout({children}: {children: React.ReactNode}) {

        return (
            <>
                <Header />
                <SessionProvider>
                    {children}
                </SessionProvider>
            </>
        );
}
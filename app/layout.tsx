import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import Script from 'next/script'
import {AnalyticsTracker} from "@/components/AnalyticsTracker";
import {GA_MEASUREMENT_ID} from "@/lib/gtag";
import ClientOnly from "@/components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const metadata: Metadata = {
    title: 'sim-log | 생각과 일상이 머무는 곳',
    description: 'sim-log는 관심사와 일상을 자연스럽게 남기고, 가볍게 공유할 수 있는 공간입니다.',
    openGraph: {
        title: 'sim-log | 생각과 일상이 머무는 곳',
        description: 'sim-log는 관심사와 일상을 자연스럽게 남기고, 가볍게 공유할 수 있는 공간입니다.',
        url: baseUrl,
        images: [
            {
                url: `${baseUrl}/opengraph-image.png`,
                width: 1200,
                height: 630,
                alt: 'Sim-log 대표 이미지',
            },
        ],
        type: 'website',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
      </Script>
        {children}
        <ClientOnly>
            <AnalyticsTracker />
        </ClientOnly>
      </body>
    </html>
  );
}

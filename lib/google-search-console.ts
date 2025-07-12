// lib/google-search-console.ts
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library'; // GoogleAuth 타입을 임포트합니다.

export async function submitSitemap({
                                 siteUrl,
                                 sitemapUrl,
                             }: {
    siteUrl: string;
    sitemapUrl: string;
}) {
    const auth = new GoogleAuth({ // 여기서 GoogleAuth를 명시적으로 사용
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
        },
        scopes: ['https://www.googleapis.com/auth/webmasters'],
    });
    console.log(process.env.GOOGLE_CLIENT_EMAIL)

    const webmasters = google.webmasters({ version: 'v3', auth });

    await webmasters.sitemaps.submit({
        siteUrl,
        feedpath: sitemapUrl,
    });
}
// app/api/submit-sitemap/route.ts (Vercel Cron이 호출할 API 라우트)

import { NextResponse, NextRequest } from 'next/server';
import {submitSitemap} from "@/lib/google-search-console";

export async function GET(request: NextRequest) { // Vercel Cron은 주로 GET 요청으로 트리거
    // vercel cron 만 허용
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        const targetSiteUrl = 'https://www.sim-log.com/'; // 귀하의 웹사이트 속성 URL
        const targetSitemapUrl = 'https://www.sim-log.com/sitemap/1'; // 귀하의 사이트맵 URL

        await submitSitemap({
            siteUrl: targetSiteUrl,
            sitemapUrl: targetSitemapUrl,
        });

        console.log(`사이트맵 '${targetSitemapUrl}'이(가) '${targetSiteUrl}'에 서비스 계정을 통해 성공적으로 제출되었습니다.`);
        return NextResponse.json({ message: `사이트맵 '${targetSitemapUrl}'이(가) 성공적으로 제출되었습니다.` });

    } catch (error: any) {
        console.error('서비스 계정을 통한 사이트맵 제출 실패:', error.message);
        return NextResponse.json({ message: '사이트맵 제출에 실패했습니다.', error: error.message }, { status: 500 });
    }
}
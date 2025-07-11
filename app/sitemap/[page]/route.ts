import getSitemapPage from "@/data-access/user-info/getSitemapPage";
import { LIMIT } from "@/const/sitemap";

type Params = Promise<{ page: string }>;

export async function GET(_: any, { params }: { params: Params }) {
    const { page } = await params;
    const pageNumber = Number(page);

    if (isNaN(pageNumber)) {
        return new Response("404 Not Found", { status: 404 });
    }

    const sitemapPages = await getSitemapPage(pageNumber);

    // 유저 사이트맵 연결
    const sitemapEntries = sitemapPages.map(user => {
        const loc = `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap/user/${user.blog_url}/1`;
        const lastmod = user.last_modified
            ? `<lastmod>${user.last_modified}</lastmod>`
            : ""; // 없으면 생략
        return `<sitemap><loc>${loc}</loc>${lastmod}</sitemap>`;
    });

    // 다음 페이지
    if (sitemapPages.length === LIMIT) {
        const nextLoc = `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap/${pageNumber + 1}`;
        const now = new Date().toISOString(); // ISO 8601 형식

        sitemapEntries.push(
            `<sitemap><loc>${nextLoc}</loc><lastmod>${now}</lastmod></sitemap>`
        );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</sitemapindex>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml" }
    });
}

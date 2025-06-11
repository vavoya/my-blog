import getSitemapPage from "@/models/post_info/getSitemapPage";
import getUserInfoByBlogUrl from "@/models/user_info/getUserInfoByBlogUrl";
import { ObjectId } from "mongodb";

type Params = Promise<{ blogSlug: string, page: string }>;

export async function GET(_: any, { params }: { params: Params }) {
    const { blogSlug, page } = await params;
    const pageNumber = Number(page);

    const blog = decodeURIComponent(blogSlug);

    const userInfo = await getUserInfoByBlogUrl(blog);

    if (isNaN(pageNumber) || !userInfo) {
        return new Response("404 Not Found", { status: 404 });
    }

    const sitemapPages = await getSitemapPage(new ObjectId(userInfo._id), pageNumber);

    const sitemapEntries = sitemapPages.map(post => {
        const loc = `${process.env.NEXT_PUBLIC_BASE_URL}/${blog}/${post.post_url}`;
        const lastmod = post.post_updatedAt.toISOString().slice(0, 10);
        return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
    });
    sitemapEntries.push(`<url><loc>${process.env.NEXT_PUBLIC_BASE_URL}/${blog}</loc><lastmod>${sitemapPages[0].post_updatedAt.toISOString().slice(0, 10)}</lastmod></url>`)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml" }
    });
}

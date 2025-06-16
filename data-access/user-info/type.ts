import {UserInfoDocument} from "@/lib/mongoDB/types/documents/userInfo.type";


export type SitemapPage = Pick<UserInfoDocument, 'user_name' | 'blog_url'>
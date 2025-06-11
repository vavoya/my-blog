import {PostInfoDocument, PostInfoResponse} from "@/lib/mongoDB/types/documents/postInfo.type";


export type PaginatedPostsDocument = Pick<PostInfoDocument, '_id' | 'post_url' | 'post_description' | 'post_name' | 'post_createdAt' | 'post_updatedAt' | 'thumb_url' | 'folder_id' | 'series_id'>;
export type PaginatedPostsResponse = Pick<PostInfoResponse, '_id' | 'post_url' | 'post_description' | 'post_name' | 'post_createdAt' | 'post_updatedAt' | 'thumb_url' | 'folder_id' | 'series_id'>;

export type SitemapPage = Pick<PostInfoDocument, 'post_url' | 'post_updatedAt'>
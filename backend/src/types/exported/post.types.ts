import { getPostPreviews, getPosts } from "@/server/repositories/post.repo";

export type Post = Awaited<ReturnType<typeof getPosts>>[0];

export type PostPreview = Awaited<ReturnType<typeof getPostPreviews>>[0];

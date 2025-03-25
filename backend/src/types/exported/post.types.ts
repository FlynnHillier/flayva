import { getPosts } from "@/server/repositories/post.repo";

export type Post = Awaited<ReturnType<typeof getPosts>>[0];

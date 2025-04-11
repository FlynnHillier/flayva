import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

type Post = {
  title: string
  photos: string[]
  tags: string[]
}

interface PostContextInterface {
  posts: Post[],
  setPosts: Dispatch<SetStateAction<Post[]>>
}

const defaultState = {
  posts: [],
  setPosts: (posts: Post[]) => {}
} as PostContextInterface

export const PostContext = createContext(defaultState);

type PostProviderProps = {
  children: ReactNode
}

export function PostsProvider( {children} : PostProviderProps)
{
  const [posts, setPosts] = useState<Post[]>([{
    title: '',
    photos: [''],
    tags: ['']
  }]);

  return (
    <PostContext.Provider value={{ posts, setPosts}}>
      {children}
    </PostContext.Provider>
  )
}
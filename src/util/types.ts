import { Comment, Like, Post } from '@prisma/client'
import { NextApiRequest } from 'next'
import { Session } from 'next-iron-session'

export type ExtendedApiRequest = NextApiRequest & {
  session: Session
}

export type NavButtonLinks = {
  title: string
  link: string
}

export interface ExtendedPost extends Post {
  comments: Comment[]
  likes: Like[]
  user?: { name: string }
}

export interface PostsWithIsNext {
  posts: ExtendedPost[]
  isNextPage: boolean
  totalPage: number
}

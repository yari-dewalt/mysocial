export interface User {
  name: string,
  username: string,
  bio: string,
  image: string,
  followers: User[],
  following: User[],
  posts: Post[],
  conversations: Conversation[],
  notifications: Notification[]
}

export interface Post {
  user: User,
  text: string,
  images: string[],
  likes: User[],
  comments: Comment[],
  edited: boolean,
  timestamp: Date
}

export interface Comment {
  user: User,
  post: Post,
  parentComment: Comment,
  text: string,
  likes: User[],
  replies: Comment[],
  edited: boolean,
  timestamp: Date
}

export interface Notification {
  from: User,
  to: User,
  type: string,
  conversation: Conversation,
  post: Post,
  text: string,
  timestamp: Date
}

export interface Message {
  from: User,
  to: User,
  conversation: Conversation,
  text: string,
  edited: boolean,
  lastEdited: Date,
  timestamp: Date
}

export interface Conversation {
  user1: User,
  user2: User,
  messages: Message[],
  lastMessage: Message
}

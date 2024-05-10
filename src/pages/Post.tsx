import type { Post } from "../types.ts";

import TextPost from "../components/TextPost";
import ImagePost from "../components/ImagePost";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Post() {
  const { postId }: string = useParams();
  const [post, setPost] = useState<Post>(null);

  useEffect(() => {
    fetchPost();
  }, []);

  async function fetchPost() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${postId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch post data");
      }
      setPost(content);
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grow flex items-center justify-center">
      {post && post.images.length > 0 &&
        (<div className="w-5/6 flex justify-center items-center">
          <ImagePost post={post}/>
        </div>)
      }
      {post && (post.images.length == 0 || !post.images) &&
        (<div className="w-5/6 flex justify-center items-center">
          <TextPost post={post}/>
        </div>)
      }
    </div>
  )
}

export default Post;

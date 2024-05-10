import UserSearchResult from "./UserSearchResult";

import { useState, useEffect } from "react";

interface Props {
  postId: string,
  checkLiked: () => void
}

function LikesArea({ postId, checkLiked }: Props) {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    fetchLikes();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [checkLiked])

  async function fetchLikes() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${postId}/likes`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      if (!response.ok) {
        throw new Error("Fetching likes failed");
      }

      const content = await response.json();
      console.log(content);
      setLikes(content);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div onClick={(e) => e.preventDefault()} className={`bg-white cursor-default ${likes.length > 0 ? "p-2" : ""} flex flex-col gap-2`}>
      {likes.map((user) => (
        <UserSearchResult key={user._id} resultUser={user}/>
      ))}
    </div>
  )
}

export default LikesArea;

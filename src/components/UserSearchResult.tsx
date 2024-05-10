import type { User } from "../types.ts";

import UserCircle from "./UserCircle";

import { AppContext } from "../App";

import { useState, useContext } from "react";
import { Link } from "react-router-dom";

function UserSearchResult({ resultUser }: User) {
  const { user } = useContext(AppContext);
  const [isFollowing, setIsFollowing] = useState<boolean>(user.following.includes(resultUser._id));

  const isSelf = (user._id == resultUser._id);

  async function followUser(e: React.MouseEvent) {
    e.preventDefault();
    try {
      setIsFollowing(true);

      const response = await fetch(`https://mysocial-backend.onrender.com/users/${resultUser._id}/follow`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ senderId: user._id })
      });

      console.log(await response.json());

      if (!response.ok) {
        throw new Error("Follow request failed");
      }

    } catch (error) {
      console.log(error);
      setIsFollowing(false);
    }
  }

  async function unfollowUser(e: React.MouseEvent) {
    e.preventDefault();
    try {
      setIsFollowing(false);

      const response = await fetch(`https://mysocial-backend.onrender.com/users/${resultUser._id}/unfollow`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ senderId: user._id })
      });

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Unfollow request failed");
      }

    } catch (error) {
      console.log(error);
      setIsFollowing(true);
    }
  }

  return (
    <div className="p-2 pr-6 hover:bg-gray-200 flex justify-between items-center gap-2 w-full">
      <div className="flex gap-2 items-center">
        <UserCircle user={resultUser} size={5}/>
        <div className="flex flex-col">
          <Link to={`/users/${resultUser._id}`} className="text-black font-medium -mb-1 hover:text-neutral-800 w-fit">{resultUser.name}</Link>
          <Link to={`/users/${resultUser._id}`} className="text-neutral-500 hover:text-neutral-600 w-fit">{resultUser.username}</Link>
        </div>
      </div>
      {!isSelf &&
        <button onClick={isFollowing ? unfollowUser : followUser} className={`p-1 pl-4 pr-4 rounded ${isFollowing ? "bg-red-400 hover:bg-red-500" : "bg-sky-400 hover:bg-sky-500"} text-white text-sm font-medium`}>{isFollowing ? "Unfollow" : "Follow"}</button>
      }
    </div>
  )
}

export default UserSearchResult;

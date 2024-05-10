import type { User } from "../types.ts";

import UserCircle from "./UserCircle";

import { AppContext } from "../App";

import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

interface Props {
  resultUser: User,
  closeModal: () => void
}

function NewMessageSearchResult({ resultUser, closeModal = () => {} }: Props) {
  const { user }: User = useContext(AppContext);
  const navigate = useNavigate();

  async function sendMessage() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${resultUser._id}/startConversation`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ senderId: user._id })
      });

      if (!response.ok) {
        throw new Error("Failed to start conversation");
      }

      const content = await response.json();
      console.log(content);

      closeModal();

      if (user.conversations.includes(content._id))
        navigate(`/messages/${content._id}`);
      else
        window.location.href = `/messages/${content._id}`;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-2 pr-6 hover:bg-gray-300 flex justify-between items-center gap-2 rounded">
      <div className="flex gap-2 items-center">
        <UserCircle user={resultUser} size={5}/>
        <div className="flex flex-col">
          <Link to={`/users/${resultUser._id}`} className="w-fit text-black hover:text-neutral-800 font-medium -mb-1">{resultUser.name}</Link>
          <Link to={`/users/${resultUser._id}`} className="w-fit text-neutral-500 hover:text-neutral-600">{resultUser.username}</Link>
        </div>
      </div>
      <button onClick={sendMessage} className={`p-1 pl-4 pr-4 rounded bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium`}>Message</button>
    </div>
  )
}

export default NewMessageSearchResult;

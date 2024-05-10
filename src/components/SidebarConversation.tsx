import type { Conversation } from "../types.ts";

import closeIcon from "../assets/close.svg";

import { AppContext } from "../App";

import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import TimeAgo from "javascript-time-ago";

interface Props {
  conversation: Conversation,
  removeConversation: () => void
}

function SidebarConversation({ conversation, removeConversation }: Props) {
  const { user } = useContext(AppContext);
  const params = useParams();
  const currentConversationId = params.conversationId;
  const isSelected: boolean = (currentConversationId == conversation._id) ? true : false;
  const conversationUser = (user._id == conversation.user1._id) ? conversation.user2 : conversation.user1;
  const shortenedText: string = conversation.lastMessage ? conversation.lastMessage.text.substring(0, 15) + "..." : "";
  const timeAgo = new TimeAgo("en-US");

  async function remove(e: React.MouseEvent) {
    e.preventDefault();
    removeConversation(conversation);
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/conversations/${conversation._id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Link to={`/messages/${conversation._id}`} className={`group flex p-2 min-w-0 justify-between items-center ${isSelected ? "bg-gray-300" : "hover:bg-gray-200"}`}>
      <div className={`grow min-w-0 flex items-center gap-2 `}>
        <img src={conversationUser.image} className="rounded-full min-w-12 min-h-12 w-12 h-12"></img>
        <div className="flex flex-col">
          <h2 className="break-words font-medium">{conversationUser.name}</h2>
          {conversation.lastMessage &&
            (<div className="flex gap-1 items-center text-sm text-neutral-600">
              <p>{conversation.lastMessage.text.length > 17 ? shortenedText : conversation.lastMessage.text}</p>
              <div className="rounded-full bg-neutral-600 min-w-0.5 max-w-0.5 min-h-0.5 max-h-0.5"></div>
              <p>{timeAgo.format(new Date(conversation.lastMessage.timestamp), "mini")}</p>
            </div>)
          }
        </div>
      </div>
      <img onClick={remove} src={closeIcon} className="opacity-0 phone:opacity-100 group-hover:hover:opacity-60 group-hover:opacity-100 min-w-4 w-4"></img>
    </Link>
  )
}

export default SidebarConversation;

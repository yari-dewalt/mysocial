// @ts-nocheck
import MessagesSidebar from "../components/MessagesSidebar";
import MessagingArea from "../components/MessagingArea";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

function Messages() {
  const { user, setLoadingProgress } = useContext(AppContext);
  const [conversations, setConversations] = useState([]);
  const params = useParams();
  const currentConversationId: string = params.conversationId;
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();

    socket.on("notify message", handleSocketEvent);
    socket.on("delete message", handleSocketEvent);

    return () => {
      socket.off("notify message", handleSocketEvent);
      socket.off("delete message", handleSocketEvent);
    };
  }, []);

  function handleSocketEvent() {
    setTimeout(() => {
      fetchConversations();
    }, 5000);
  }

  async function fetchConversations() {
    try {
      setLoadingProgress(20);
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/conversations`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      setConversations(content);

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      
      setLoadingProgress(100);
    } catch (error) {
      setLoadingProgress(0.001);
      console.log(error);
    }
  }

  function removeConversation(conversation) {
    const newConversations = conversations.filter((item) => item._id != conversation._id);
    setConversations(newConversations);
    if (currentConversationId == conversation._id)
      navigate("/messages");
  }

  return (
    <div className="grow flex max-w-full overflow-x-hidden">
      <MessagesSidebar conversations={conversations} removeConversation={removeConversation}/>
      <MessagingArea/>
    </div>
  )
}

export default Messages;

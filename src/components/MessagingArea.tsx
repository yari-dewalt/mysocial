import MessagingHeader from "./MessagingHeader";
import Message from "./Message";
import SuggestedBox from "./SuggestedBox";

import sendIcon from "../assets/send.svg";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function MessagingArea() {
  const { user, setLoadingProgress } = useContext(AppContext);
  const params = useParams();
  const conversationId = params.conversationId;
  const [conversationUser, setConversationUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    if (conversationId)
      fetchConversationData();
  }, [conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  async function fetchConversationData() {
    try {
      setLoadingProgress(20);
      const response = await fetch(`https://mysocial-backend.onrender.com/conversations/${conversationId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      console.log(content);
      setConversationUser((user._id == content.user1._id) ? content.user2 : content.user1);
      setMessages(content.messages);

      if (!response.ok) {
        throw new Error("Failed to fetch conversation data");
      }
      
      setLoadingProgress(100);
      socket.emit("join room", content._id);
    } catch (error) {
      setLoadingProgress(0.001);
      console.log(error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewMessageText(e.target.value);
    if (e.target.value.trim().length > 0) {
      socket.emit("typing", user._id);
    } else {
      socket.emit("typing", null);
    }
  }

  async function sendMessage(e: React.MouseEvent | React.FormEvent) {
    e.preventDefault();
    if (newMessageText.trim().length > 0) {
      socket.emit("message", {
        from: user,
        to: conversationUser,
        text: newMessageText,
        timestamp: Date.now()
      });
      setNewMessageText(""); // Clear the input field after sending the message
      socket.emit("typing", null);
    }

    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${conversationUser._id}/message`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify(
          {
            senderId: user._id,
            text: newMessageText
          }
      )});

      const content = await response.json();
      console.log(content);

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      socket.emit("notify message", conversationUser._id);
      socket.emit("notify message", user._id);
      socket.emit("notify general", conversationUser._id);
    } catch (error) {
      console.log(error);
    }
  }

  function handleMessages(newMessage) {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  }

  
  function editMessage(editedMessage) {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg._id === editedMessage._id ? editedMessage : msg
      )
    );
  }

  function deleteMessage(message) {
    setMessages(prevMessages => prevMessages.filter(msg => msg._id !== message._id));
  }

  function handleTyping(userId) {
    if (conversationUser && userId == conversationUser._id) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }

  async function fetchSuggestedUsers() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/random?amount=3`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      console.log(content);

      if (!response.ok) {
        throw new Error("Failed to fetch conversation data");
      }

      setSuggestedUsers(content);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    socket.on("message", handleMessages);
    socket.on("edit message", editMessage);
    socket.on("delete message", deleteMessage);
    socket.on("typing", handleTyping);
    return () => {
      socket.off("message", handleMessages);
      socket.off("edit message", editMessage);
      socket.off("delete message", deleteMessage);
      socket.off("typing", handleTyping);
    }
  }, [conversationUser]);


  return (
    <>
      {conversationId &&
        <div className="grow min-w-0 flex flex-col justify-between max-h-screen">
          <div className="flex flex-col grow overflow-y-auto">
            {conversationUser &&
              <MessagingHeader user={conversationUser}/>
            }
            <div className="flex flex-col p-2 grow overflow-y-auto overflow-x-hidden">
              {messages && messages.map((message) =>
                <Message key={uuidv4()} message={message}/>
              )}
              {isTyping &&
                <div className="flex gap-2">
                  <img src={conversationUser.image} className="rounded-full min-w-8 w-8 min-h-8 h-8 object-cover"></img>
                  <div className="flex justify-center items-center bg-neutral-400 rounded-2xl animate-pulse w-10">
                    <div className="flex gap-1 items-center">
                      <div className="min-w-2 min-h-2 rounded-full bg-white animate-bounce animation-delay-none"></div>
                      <div className="min-w-2 min-h-2 rounded-full bg-white animate-bounce animation-delay-150"></div>
                      <div className="min-w-2 min-h-2 rounded-full bg-white animate-bounce animation-delay-300"></div>
                    </div>
                  </div>
                </div>
              }
              <div ref={messagesEndRef}></div>
            </div>
          </div>
          <div className="max-h-8 h-8 mb-2 ml-2 mr-2 flex border border-neutral-400 rounded-lg bg-white">
            <form onSubmit={sendMessage} className="grow">
              <input value={newMessageText} onChange={handleChange} placeholder={`Message...`} className="w-full text-sm outline-none p-1 bg-transparent"></input>
            </form>
            {newMessageText.trim().length > 0
              ? <img onClick={sendMessage} src={sendIcon} alt="send" className="min-w-3 hover:cursor-pointer"></img>
              : <img src={sendIcon} alt="send" className="min-w-3 opacity-65"></img>
            }
          </div>
        </div>
      }
      {!conversationId &&
        <div className="grow min-w-0 flex flex-col gap-6 justify-center items-center text-center max-h-screen overflow-hidden">
          <h1 className="font-medium text-2xl">Start chatting with other users!</h1>
          <SuggestedBox users={suggestedUsers} type="message"/>
          <p><span className="font-medium">Tip:</span> You can click on a message (that you have sent) to either edit or delete it!</p>
        </div>
      }
    </>
  )
}

export default MessagingArea;

// @ts-nocheck
import type { Conversation, User } from "../types.ts";

import SearchBar from "../components/SearchBar";
import SidebarConversation from "../components/SidebarConversation";
import NewMessageModal from "../components/NewMessageModal";

import expandIcon from "../assets/expand.svg";

import { AppContext } from "../App";

import { useState, useContext, useEffect } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import { motion } from "framer-motion";

interface Props {
  conversations: Conversation[],
  removeConversation: () => void
}

function MessagesSidebar({ conversations, removeConversation }: Props) {
  const { user }: User = useContext(AppContext);
  const [newMessageModalOpen, setNewMessageModalOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const isPhone: boolean = useMediaQuery("(max-width: 610px)");

  function toggleNewMessageModal() {
    setNewMessageModalOpen(!newMessageModalOpen);
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  useEffect(() => {
      searchConversations(searchValue);
  }, [searchValue]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value.trim();
    setSearchValue(value);

    if (value === "") {
      setSearchResults(conversations);
      return;
    }
  }

  function searchConversations(keyword: string) {
    const newResults = conversations.filter((conversation) => {
      const conversationUser = user._id == conversation.user1._id ? conversation.user2 : conversation.user1;
      return conversationUser.username.toLowerCase().includes(keyword.toLowerCase()) || conversationUser.name.toLowerCase().includes(keyword.toLowerCase());
    });
    console.log(newResults);
    setSearchResults(newResults);
  }

  return (
    <>
      {isPhone && !sidebarOpen && (
        <button className="shadow-[rgba(0,0,15,0.1)_0px_0px_0px_3px] absolute top-0 left-0 translate-x-1/3 translate-y-1/3 min-w-10 min-h-10 bg-white rounded-full flex justify-center align-center" onClick={toggleSidebar}>
          <img src={expandIcon} className="min-w-full -rotate-90"></img>
        </button>
      )}
      {(!isPhone || sidebarOpen) && (
        <motion.div
          className="z-10 flex flex-col items-center gap-2 bg-white max-w-64 phone:max-w-52 phone:absolute phone:min-h-full"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100% "}}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="max-w-full overflow-x-hidden">
            <SearchBar placeholder="Search messages" handleChange={handleSearchChange}/>
          </div>
          <div onClick={toggleNewMessageModal} className="w-full group text-neutral-500 flex pl-2 pr-2 justify-between hover:cursor-pointer">
            <p className="font-medium group-hover:text-neutral-700">New Message</p>
            <p className="font-medium hover:cursor-pointer hover:text-neutral-700">+</p>
          </div>
          <div className="w-full flex flex-col">
            {searchResults.length == 0 && searchValue.trim() == "" && conversations.map((conversation) =>
              <SidebarConversation key={conversation.id} conversation={conversation} removeConversation={removeConversation}/>
            )}
            {searchResults.length > 0 && searchResults.map((conversation) =>
              <SidebarConversation key={conversation.id} conversation={conversation} removeConversation={removeConversation}/>
            )}
          </div>
          {newMessageModalOpen &&
            <NewMessageModal closeModal={toggleNewMessageModal}/>
          }
        </motion.div>
      )}
      {(isPhone && sidebarOpen) && (
        <div onClick={toggleSidebar} className="absolute top-0 left-0 min-w-full min-h-screen bg-black opacity-10">
        </div>
      )}
    </>
  )
}

export default MessagesSidebar;

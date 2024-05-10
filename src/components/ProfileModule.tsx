// @ts-nocheck
import type { User } from "../types.ts";

import messagesIcon from "../assets/messages.svg";
import selectedMessagesIcon from "../assets/selected_messages.svg";
import profileIcon from "../assets/profile.svg";
import selectedProfileIcon from "../assets/selected_profile.svg";

import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";


function ProfileModule({ user }: User) {
  const location = useLocation();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (location.pathname.includes("/messages")) {
      setSelected("messages");
    } else if (location.pathname.includes(user._id)) {
      setSelected("profile");
    } else {
      setSelected("");
    }
  }, [location]);

  return (
    <div className="flex flex-col bg-white shadow-[0px_0px_3px_2px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
      <Link to="/messages" className="p-2 flex align-center gap-2 hover:bg-slate-300">
        <img src={selected == "messages" ? selectedMessagesIcon : messagesIcon}></img>
        <h3>Messages</h3>
      </Link>
      <Link to={`/users/${user._id}`} className="p-2 flex align-center gap-2 hover:bg-slate-300">
        <img src={selected == "profile" ? selectedProfileIcon : profileIcon} className="invert"></img>
        <h3>View Profile</h3>
      </Link>
    </div>
  )
}

export default ProfileModule;

import type { User } from "../types.ts";

import UserCircle from "./UserCircle";
import SuggestedBox from "./SuggestedBox";

import { AppContext } from "../App";

import { useContext } from "react";

interface Props {
  user: User,
  suggestedUsers: User[]
}

function SideInfo({ user, suggestedUsers }: Props) {
  const { handleUser, setLoadingProgress } = useContext(AppContext);

  async function logOut() {
    try {
      setLoadingProgress(20);
      localStorage.removeItem("user");
      const response = await fetch("https://mysocial-backend.onrender.com/users/logout",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Logout failed");
      }

      handleUser(null);
      setLoadingProgress(100);
    } catch (error) {
      console.log(error);
      setLoadingProgress(0.01);
    }
  }

  return (
    <div className="phone:hidden sticky shrink-0 top-16 gap-10 h-fit flex flex-col">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle user={user} size={6}/>
          <div className="flex flex-col">
            <h3 className="font-medium text-lg">{user.name}</h3>
            <p className="text-neutral-600 -mt-1.5">{`${user.username}`}</p>
          </div>
        </div>
        <button onClick={logOut} className="whitespace-nowrap font-bold text-white p-1 bg-red-400 rounded">Log Out</button>
      </div>
      <SuggestedBox users={suggestedUsers} type="follow"/>
    </div>
  )
}

export default SideInfo;

import SearchBar from "./SearchBar";
import NewMessageSearchResult from "./NewMessageSearchResult";
import UserSearchResultSkeleton from "./UserSearchResultSkeleton";

import closeIcon from "../assets/close.svg";

import { AppContext } from "../App";

import { useState, useEffect, useContext } from "react";

function NewMessageModal({ closeModal }) {
  const { user } = useContext(AppContext);
  const [searchValue, setSearchValue] = useState<string>("");
  const [following, setFollowing] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("all");

  const LIMIT = 20;
  const OFFSET = 0;

  useEffect(() => {
    fetchFollowing();
  }, []);

  useEffect(() => {
    if (tab == "all") {
      if (searchValue.trim() != "") {
        const delayDebounce = setTimeout(() => {
            searchUsers(searchValue).then(() => setIsLoading(false));
        }, 750);

        return () => clearTimeout(delayDebounce);
      }
    } else if (tab == "following") {
        if (searchValue.trim() == "") {
          setSearchResults(following);
        } else {
            searchFollowing(searchValue);
          }
    }
  }, [searchValue]);

  useEffect(() => {
    if (tab == "following") {
      if (searchValue.trim() == "") {
        setSearchResults(following);
      } else {
        searchFollowing(searchValue);
      }
    } else if (tab == "all") {
      if (searchValue.trim() == "") {
        setSearchResults([]);
      } else {
        searchUsers(searchValue);
      }
    }
  }, [tab])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value.trim();
    setSearchValue(value);

    if (value === "" && tab == "all") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    if (tab == "all")
      setIsLoading(true);
  }

  async function searchUsers(keyword: string) {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/search?keyword=${keyword}&limit=${LIMIT}&offset=${OFFSET}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      if (!response.ok) {
        throw new Error("Searching users failed");
      }
      
      const users = await response.json();

      const filteredUsers = users.filter(item => item._id != user._id);

      console.log(filteredUsers);
      setSearchResults(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchFollowing() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/following`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      console.log(content);
      setFollowing(content);

      if (!response.ok) {
        throw new Error("Failed to fetch user connections");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  function searchFollowing(keyword: string) {
    setIsLoading(false);
    const newResults = following.filter((user) => {
      return user.username.toLowerCase().includes(keyword.toLowerCase()) || user.name.toLowerCase().includes(keyword.toLowerCase());
    });
    setSearchResults(newResults);
  }

  return (
    <div className="z-20 w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-20">
      <div className="relative w-96 phone:w-80 bg-white rounded flex flex-col items-center gap-4 p-4 shadow-[0px_0px_3px_2px_rgba(0,0,0,0.25)]">
        <h2 className="text-center text-xl font-medium break-words">Select User</h2>
        <div className="flex justify-center w-full">
          <button onClick={() => setTab("all")} className={`grow text-center p-2 font-medium shadow-sm border-b-2 ${tab == "all" ? "border-black text-black" : "border-neutral-200 text-neutral-500"}`}>All Users</button>
          <button onClick={() => setTab("following")} className={`grow text-center p-2 font-medium shadow-sm border-b-2 ${tab == "following" ? "border-black text-black" : "border-neutral-200 text-neutral-500"}`}>Following</button>
        </div>
        <div className="w-full">
          <SearchBar placeholder={`Search ${tab == "all" ? "all users" : "following"}`} handleChange={handleSearchChange}/>
        </div>
        {!isLoading &&
          (<div className="flex flex-col w-full max-h-52 overflow-y-auto overflow-x-hidden">
          {searchResults.map((result) =>
            <NewMessageSearchResult resultUser={result} closeModal={closeModal}/>
          )}
          </div>)
        }
        {isLoading &&
          (<div className="flex flex-col w-full max-h-64 overflow-y-auto overflow-x-hidden">
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
          </div>)
        }
        <img onClick={closeModal} src={closeIcon} className="absolute top-2 right-2 min-w-5 w-5 hover:cursor-pointer hover:opacity-65"></img>
      </div>
    </div>
  )
}

export default NewMessageModal;

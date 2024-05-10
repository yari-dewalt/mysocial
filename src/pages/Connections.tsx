// @ts-nocheck
import type { User } from "../types.ts";

import SearchBar from "../components/SearchBar";
import UserSearchResult from "../components/UserSearchResult";

import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

function Connections() {
  const location = useLocation();
  const { userId }: string = useParams();
  const tab: string = location.search.includes("followers") ? "followers" : "following";
  const [user, setUser] = useState<User>(null);
  const [results, setResults] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    fetchUser(userId);
    fetchConnections();
  }, [location]);

  async function fetchUser(userId: string) {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      setUser(content);

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value.toLowerCase();
    setSearchValue(value);
    if (value.trim() != "") {
      const filteredResults = results.filter(result => result.name.toLowerCase().includes(value) || result.username.toLowerCase().includes(value));
      setSearchResults(filteredResults);
    }
    else
      setSearchResults([]);
  }

  async function fetchConnections() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${userId}/${tab}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      setResults(content);

      if (!response.ok) {
        throw new Error("Failed to fetch user connections");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  function resetResults() {
    setResults([]);
  }

  return (
    <div className="grow flex justify-center">
      <div className="flex flex-col bg-white w-full h-fit">
        {user &&
          (<div className="pt-2 flex flex-col items-center justify-center">
            <Link to={`/users/${user._id}`} className="hover:text-neutral-700 font-bold text-xl -mb-1">{user.name}</Link>
            <Link to={`/users/${user._id}`} className="hover:text-neutral-600 text-neutral-500">{`@${user.username}`}</Link>
          </div>)
        }
        <div className="flex w-full">
          {user &&
            (<Link onClick={resetResults} to={`/users/${userId}/connections?tab=followers`} className={`grow text-center p-2 font-medium shadow-sm border-b-2 ${tab == "followers" ? "border-black text-black" : "border-neutral-200 text-neutral-500"}`}>{`${user.followers.length} Followers`}</Link>)
          }
          {user &&
            (<Link onClick={resetResults} to={`/users/${userId}/connections?tab=following`} className={`grow text-center p-2 font-medium shadow-sm border-b-2 ${tab == "following" ? "border-black text-black" : "border-neutral-200 text-neutral-500"}`}>{`${user.following.length} Following`}</Link>)
          }
        </div>
        <SearchBar handleChange={handleSearchChange} placeholder={`Search ${tab}`}/>
        {searchValue &&
          <h2 className="pl-2 text-lg font-bold">{`Results (${searchResults.length})`}</h2>
        }
        <div className="flex flex-col gap-2 bg-white">
          {!searchValue && results.map((result) => (
            <UserSearchResult key={result._id} resultUser={result}/>
          ))}
          {searchValue && searchResults.map((result) => (
            <UserSearchResult key={result._id} resultUser={result}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Connections;

import SearchBar from "../components/SearchBar";
import UserSearchResult from "../components/UserSearchResult";
import PostSearchResult from "../components/PostSearchResult";
import UserSearchResultSkeleton from "../components/UserSearchResultSkeleton";
import PostSearchResultSkeleton from "../components/PostSearchResultSkeleton";

import { AppContext } from "../App";

import { useState, useEffect, useContext } from "react";

function Search() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [option, setOption] = useState<string>("users");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useContext(AppContext);
  const LIMIT = 100;
  const OFFSET = 0;

  useEffect(() => {
    if (option == "users" && searchValue.trim() != "") {
      setIsLoading(true);
      searchUsers(searchValue).then(() => setIsLoading(false));
    }
    else if (option == "posts" && searchValue.trim() != "") {
      setIsLoading(true);
      searchPosts(searchValue).then(() => setIsLoading(false));
    }
  }, [option])

  useEffect(() => {
    if (searchValue.trim() != "") {
      const delayDebounce = setTimeout(() => {
        if (option === "users") {
          searchUsers(searchValue).then(() => setIsLoading(false));
        } else if (option === "posts") {
          searchPosts(searchValue).then(() => setIsLoading(false));
        }
      }, 750);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchValue]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value.trim();

    setSearchValue(value);

    if (value === "") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

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

  async function searchPosts(keyword: string) {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/search?keyword=${keyword}&limit=${LIMIT}&offset=${OFFSET}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      if (!response.ok) {
        throw new Error("Searching posts failed");
      }
      
      const posts = await response.json();

      const filteredPosts = posts.filter(item => item.user._id != user._id);

      console.log(filteredPosts);
      setSearchResults(filteredPosts);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grow flex justify-center max-h-screen">
      <div className="w-full flex flex-col">
        <div className="flex flex-col bg-white">
          <SearchBar handleChange={handleSearchChange} placeholder={`Search ${option}`}/>
          <div className="flex justify-between">
            <button onClick={() => setOption("users")} className={`shadow-sm font-medium p-2 border-b-2 ${option == "users" ? "border-black text-black" : "border-neutral-200 text-neutral-500"} grow`}>Users</button>
            <button onClick={() => setOption("posts")} className={`shadow-sm font-medium p-2 border-b-2 ${option == "posts" ? "border-black text-black" : "border-neutral-200 text-neutral-500"} grow`}>Posts</button>
          </div>
        </div>
        {isLoading && option == "users" &&
          (<div className="flex flex-col gap-2 bg-white overflow-y-auto overflow-x-hidden">
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
            <UserSearchResultSkeleton/>
          </div>)
        }
        {isLoading && option == "posts" &&
          (<div className="flex flex-col gap-2 bg-white overflow-y-auto overflow-x-hidden">
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
            <PostSearchResultSkeleton/>
          </div>)
        }
        {searchResults.length > 0 && !isLoading &&
          (<div className="flex flex-col items-center gap-2 bg-white overflow-y-auto overflow-x-hidden">
            <h2 className="p-2 -mb-1 font-bold text-xl self-start">{`Results (${searchResults.length})`}</h2>
            {searchResults.map((result) => {
              if (option == "users") {
                return <UserSearchResult key={result._id} resultUser={result}/>;
              }
              else if (option == "posts") {
                return <PostSearchResult key={result._id} post={result}/>;
              }
            })}
          </div>)
        }
      </div>
    </div>
  )
}

export default Search;

// @ts-nocheck
import type { Post, User } from "../types.ts";

import SideInfo from "../components/SideInfo";
import TextPost from "../components/TextPost";
import ImagePost from "../components/ImagePost";
import PostSkeleton from "../components/PostSkeleton";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useContext, useEffect } from "react";

function Home() {
  const { user, setLoadingProgress } = useContext(AppContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNewPostNotification, setShowNewPostNotification] = useState<boolean>(false);
  const [newPostAmount, setNewPostAmount] = useState<number>(0);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false); // Flag to prevent multiple fetch calls
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchNewestPostsFromFollowing(offset);
    fetchSuggestedUsers();
    fetchFeaturedPosts();

    socket.on("notify post", handleSocketEvent);

    return () => {
      socket.off("notify post", handleSocketEvent);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && !noMorePosts) {
          fetchMorePosts();
        }
      },
      { threshold: 1 }
    );

    observer.observe(document.querySelector("#load-more-trigger"));

    return () => {
      observer.disconnect();
    };
  }, [offset, isFetchingMore, isLoading]);

  function handleSocketEvent() {
    setNewPostAmount(prevAmount => prevAmount + 1);
    setShowNewPostNotification(true);
  }

  async function fetchNewestPostsFromFollowing(offset: number) {
    try {
      setIsLoading(true);
      setLoadingProgress(20);
      setShowNewPostNotification(false);
      setNewPostAmount(0);
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/following/posts?offset=${offset}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch posts from following");
      }
      
      if (posts.length == 0)
        setPosts(content);
      if (posts.length > 0)
        setPosts(prevPosts => [...prevPosts, ...content]);

      if (content.length == 0)
        setNoMorePosts(true);
      else
        setNoMorePosts(false);

      setLoadingProgress(100);
      setIsLoading(false);
      return content;
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMorePosts() {
    if (!isLoading) {
      setIsFetchingMore(true); // Set flag to true when fetching more posts
      const newOffset = offset + 10;
      setOffset(newOffset);
      await fetchNewestPostsFromFollowing(newOffset);
      setIsFetchingMore(false); // Reset flag after fetching is done
    }
  }

  async function fetchFeaturedPosts() {
    try {
      setIsLoading(true);
      setLoadingProgress(20);
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/posts/featured?amount=5`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch featured posts");
      }
      
      setFeaturedPosts(content);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadNewPosts() {
    setPosts([]);
    const zeroOffset = 0;
    setOffset(zeroOffset);
    await fetchNewestPostsFromFollowing(zeroOffset);
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

      if (!response.ok) {
        throw new Error("Failed to fetch conversation data");
      }

      setSuggestedUsers(content);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative grow flex p-10 gap-3 justify-center">
      <div className="relative grow flex flex-col items-center gap-4">
        {showNewPostNotification &&
          <button onClick={loadNewPosts} className="z-10 sticky top-10 left-1/2 max-h-10 -translate-x-1/2 bg-sky-500 rounded-lg text-white font-medium p-2">{`(${newPostAmount}) New posts`}</button>
        }
        {isLoading &&
          (<div className="flex flex-col w-full items-center gap-4">
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
          </div>)
        }
        {posts.map((post) => {
          if (post.images.length > 0) {
            return <ImagePost key={post._id} post={post}/>
          } else {
            return <TextPost key={post._id} post={post}/>
          }
        }
        )}
        {noMorePosts && !isLoading &&
          (<div className="flex flex-col items-center gap-2">
            <h1 className="text-6xl font-medium text-center text-neutral-800">😧</h1>
            <h1 className="text-3xl font-medium text-center text-neutral-800">Looks like there aren't any posts</h1>
            <h1 className="text-xl font-medium text-center text-neutral-700">Try following more users to see what they're up to!</h1>
          </div>)
        }
        {noMorePosts && featuredPosts.length > 0 &&
          (<>
            <h1 className="mt-8 text-3xl text-neutral-800 font-medium text-center">Featured Posts</h1>
            {featuredPosts.map((post) => {
              if (post.images && post.images.length > 0) {
                return <ImagePost key={post._id} post={post}/>
              } else {
                return <TextPost key={post._id} post={post}/>
              }
            }
            )}
          </>)
        }
        <div id="load-more-trigger" style={{ height: "1px" }}></div>
      </div>
      <div className="flex justify-center">
        <SideInfo user={user} suggestedUsers={suggestedUsers}/>
      </div>
    </div>
  )
}

export default Home;

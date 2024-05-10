// @ts-nocheck
import type { Post } from "../types.ts";

import ImagePost from "./ImagePost";
import TextPost from "./TextPost";

import postIcon from "../assets/post.svg";
import postIconSelected from "../assets/post_selected.svg";
import imagePostIcon from "../assets/image_post.svg";
import imagePostIconSelected from "../assets/image_post_selected.svg";
import textPostIcon from "../assets/text_post.svg";
import textPostIconSelected from "../assets/text_post_selected.svg";

import { useState } from "react";

function PostsArea({ posts }: Post[]) {
  const [option, setOption] = useState<string>("all");

  return (
    <div className="flex flex-col items-center p-10 w-[40rem] phone:max-w-[22rem]">
      <div className="bg-white w-full flex justify-between border-2 border-black rounded-tl-lg rounded-tr-lg">
        <button onClick={() => setOption("all")} className={`flex rounded-tl items-center justify-center grow p-4 ${option == "all" ? "bg-neutral-300" : ""}`}>
          <img alt="All posts" src={option == "all" ? postIconSelected : postIcon} className="min-w-8"></img>
        </button>
        <button onClick={() => setOption("image")} className={`flex item-center justify-center grow p-4 ${option == "image" ? "bg-neutral-300" : ""}`}>
          <img alt="Image posts" src={option == "image" ? imagePostIconSelected : imagePostIcon} className="min-w-8"></img>
        </button>
        <button onClick={() => setOption("text")} className={`flex rounded-tr items-center justify-center grow p-4 ${option == "text" ? "bg-neutral-300" : ""}`}>
          <img alt="Text posts" src={option == "text" ? textPostIconSelected : textPostIcon} className="min-w-8"></img>
        </button>
      </div>
      <div className="w-full flex flex-col-reverse gap-3 items-center">
        {posts.map((post) => {
          if (option == "all") return post.images.length > 0 ? <ImagePost key={post._id} post={post}/> : <TextPost key={post._id} post={post}/>
          else if (option == "text") return post.images.length > 0 ? <></> : <TextPost key={post._id} post={post}/>
          else if (option == "image") return post.images.length > 0 ? <ImagePost key={post._id} post={post}/> : <></>
        })}
        {posts.length == 0 &&
          (<div className="w-full bg-white flex flex-col items-center justify-center gap-1 pt-6 pb-6 p-2">
            <h1 className="text-5xl">📝</h1>
            <h1 className="text-2xl text-center font-medium text-neutral-700">This user currently has no posts</h1>
          </div>)
        }
      </div>
    </div>
  )
}

export default PostsArea;

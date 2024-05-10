// @ts-nocheck
import type { Post, User } from "../types.ts";

import UserCircle from "./UserCircle";
import CommentsArea from "./CommentsArea";
import OptionsModal from "./OptionsModal";
import DeleteModal from "./DeleteModal";
import LikesArea from "./LikesArea";
import ImageViewer from "./ImageViewer";

import likeIcon from "../assets/like.svg";
import filledLikeIcon from "../assets/filled_like.svg";
import commentIcon from "../assets/comment.svg";
import filledCommentIcon from "../assets/filled_comment.svg";
import moreIcon from "../assets/more.svg";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";

function ImagePost({ post }: Post) {
  const { user }: User = useContext(AppContext);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsAmount, setCommentsAmount] = useState<number>(post.comments.length);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(post.edited);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [postText, setPostText] = useState<string>(post.text);
  const [isLiked, setIsLiked] = useState<boolean>(post.likes.includes(user._id));
  const [numLikes, setNumLikes] = useState<number>(post.likes.length);
  const [showLikes, setShowLikes] = useState<boolean>(false);
  const [checkLiked, setCheckLiked] = useState<boolean>(false);

  const MAX_CHAR_AMOUNT: number = 500;

  const isOwner: boolean = user._id == post.user._id ? true : false;
  const timeAgo: TimeAgo = new TimeAgo("en-US");

  function toggleShowLikes(e: React.MouseEvent) {
    e.preventDefault();
    if (showComments)
      toggleShowComments(e);
    setShowLikes(!showLikes);
  }

  function handleCommentsAmount(newAmount: number) {
    setCommentsAmount(newAmount);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPostText(e.target.value);
  }

  function toggleIsEditing(e: React.MouseEvent) {
    e.preventDefault();
    toggleShowOptions(e);
    setIsEditing(!isEditing);
    setPostText(post.text);
  }

  function toggleIsDeleting(e: React.MouseEvent) {
    e.preventDefault();
    toggleShowOptions(e);
    setIsDeleting(!isDeleting);
  }

  function toggleShowOptions(e: React.MouseEvent) {
    e.preventDefault();
    setShowOptions(!showOptions);
  }

  function toggleShowComments(e: React.MouseEvent) {
    e.preventDefault();
    if (showLikes)
      toggleShowLikes(e);
    setShowComments(!showComments);
  }

  async function editPost() {
    try {
      post.text = postText;
      setIsEditing(false);
      setIsEdited(true);
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${post._id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ text: postText })
      });

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Editing post failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePost() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${post._id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Deleting post failed");
      }

      window.location.href = location.pathname.includes(post._id) ? "/" : location.pathname;
    } catch (error) {
      console.log(error);
    }
  }

  async function likePost(e: React.MouseEvent) {
    e.preventDefault();
    try {
      setIsLiked(true);
      setNumLikes(numLikes + 1);
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${post._id}/like`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({
            userId: user._id
        })
      });

      if (!response.ok) {
        throw new Error("Liking post comment failed");
      }

      const content = await response.json();
      console.log(content);
      setCheckLiked(true);

      if (post.user._id != user._id)
        socket.emit("notify general", post.user._id);
    } catch (error) {
      setIsLiked(false);
      setNumLikes(numLikes - 1);
      console.log(error);
    }
  }

  async function unlikePost(e: React.MouseEvent) {
    e.preventDefault();
    try {
      setIsLiked(false);
      setNumLikes(numLikes - 1);
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${post._id}/unlike`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({
            userId: user._id
        })
      });

      if (!response.ok) {
        throw new Error("Unliking post comment failed");
      }

      const content = await response.json();
      console.log(content);
      setCheckLiked(false);
    } catch (error) {
      setIsLiked(true);
      setNumLikes(numLikes + 1);
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col max-w-[40rem] min-w-[17rem] bg-white w-full phone:w-full shadow-[0px_0px_3px_2px_rgba(0,0,0,0.25)]">
      {!isEditing &&
        (<Link to={`/posts/${post._id}`} className="max-w-[40rem] bg-white relative w-full phone:w-full">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-2 items-center">
                <UserCircle user={post.user} size={4}/>
                <div className="flex gap-1 items-center">
                  <Link to={`/users/${post.user._id}`} className="hover:text-neutral-700 font-bold">{post.user.name}</Link>
                  <Link to={`/users/${post.user._id}`} className="text-neutral-500 hover:text-neutral-600 text-sm">{`${post.user.username}`}</Link>
                </div>
              </div>
              {isOwner &&
                <div className="relative">
                  <img onClick={toggleShowOptions} src={moreIcon} alt="more options" className="opacity-65 hover:opacity-100"></img>
                  {showOptions &&
                    <OptionsModal handleEditState={toggleIsEditing} handleDeleteState={toggleIsDeleting}/>
                  }
                </div>
              }
            </div>
            {post.images &&
              (<div onClick={(e) => e.preventDefault()}>
                <ImageViewer images={post.images}/>
              </div>)
            }
            <div className="flex gap-2 p-2 pl-3 pr-3">
              <img onClick={isLiked ? unlikePost : likePost} alt="like" src={isLiked ? filledLikeIcon : likeIcon} className={`min-w-7 ${isLiked ? "opacity-75" : "opacity-65"}`}></img>
              <img onClick={toggleShowComments} alt="comment" src={showComments ? filledCommentIcon : commentIcon} className={`min-w-7 ${showComments ? "opacity-75" : "opacity-65"}`}></img>
            </div>
            <div className="flex flex-col pl-3 pr-3 pb-4 gap-1">
              <p className="break-words">{post.text}</p>
              <div className="flex gap-1 items-center -mt-1">
                <p className="text-neutral-500">{timeAgo.format(new Date(post.timestamp))}</p>
                {isEdited && <p className="text-xs text-neutral-500">(edited)</p>}
              </div>
              <div className="flex gap-2 text-sm">
                <div onClick={toggleShowLikes} className="flex gap-1">
                  <p className="font-semibold">{numLikes}</p>
                  <p className="text-neutral-700 hover:black hover:underline">likes</p>
                </div>
                <div onClick={toggleShowComments} className="flex gap-1">
                  <p className="font-semibold">{commentsAmount}</p>
                  <p className="text-neutral-700 hover:black hover:underline">comments</p>
                </div>
              </div>
            </div>
          </div>
        </Link>)
      }
      {isEditing &&
        (<div className="max-w-[40rem] bg-white relative w-full phone:w-full">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-2 items-center">
                <UserCircle user={post.user} size={4}/>
                <div className="flex gap-1 items-center">
                  <Link to={`/users/${post.user._id}`} className="hover:text-neutral-700 font-bold">{post.user.name}</Link>
                  <Link to={`/users/${post.user._id}`} className="text-neutral-500 hover:text-neutral-600 text-sm">{`${post.user.username}`}</Link>
                </div>
              </div>
              {isOwner &&
                <div className="relative">
                  <img onClick={toggleShowOptions} src={moreIcon} alt="more options" className="opacity-65 hover:opacity-100"></img>
                  {showOptions &&
                    <OptionsModal handleEditState={toggleIsEditing} handleDeleteState={toggleIsDeleting}/>
                  }
                </div>
              }
            </div>
            {post.images &&
              (<div onClick={(e) => e.preventDefault()}>
                <ImageViewer images={post.images}/>
              </div>)
            }
            <div className="flex gap-2 p-2 pl-3 pr-3">
              <img onClick={isLiked ? unlikePost : likePost} alt="like" src={isLiked ? filledLikeIcon : likeIcon} className={`min-w-7 ${isLiked ? "opacity-75" : "opacity-65"}`}></img>
              <img onClick={toggleShowComments} alt="comment" src={showComments ? filledCommentIcon : commentIcon} className={`min-w-7 ${showComments ? "opacity-75" : "opacity-65"}`}></img>
            </div>
            <div className="flex flex-col pl-3 pr-3 pb-4 gap-1">
              <div className="flex flex-col gap-1">
                <textarea onChange={handleEditChange} value={postText} className="h-20 p-1 rounded border-2 border-sky-500 outline-none resize-none"></textarea>
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <button onClick={toggleIsEditing} className="p-1 bg-red-400 hover:bg-red-500 text-white font-medium rounded">Cancel</button>
                    {postText.length <= MAX_CHAR_AMOUNT
                      ? <button onClick={editPost} className="p-1 bg-green-400 hover:bg-green-500 text-white font-medium rounded">Confirm</button>
                      : <button className="hover:cursor-default opacity-50 p-1 bg-green-400 text-white font-medium rounded">Confirm</button>
                    }
                  </div>
                  <p className="font-medium text-neutral-500"><span className={`font-normal ${postText.length > MAX_CHAR_AMOUNT ? "text-red-500" : ""}`}>{postText.length}</span>{` / ${MAX_CHAR_AMOUNT}`}</p>
                </div>
              </div>
              <div className="flex gap-1 items-center -mt-1">
                <p className="text-neutral-500">{timeAgo.format(new Date(post.timestamp))}</p>
                {isEdited && <p className="text-xs text-neutral-500">(edited)</p>}
              </div>
              <div className="flex gap-2 text-sm">
                <div onClick={toggleShowLikes} className="flex gap-1">
                  <p className="font-semibold">{numLikes}</p>
                  <p className="text-neutral-700 hover:black hover:underline">likes</p>
                </div>
                <div onClick={toggleShowComments} className="flex gap-1">
                  <p className="font-semibold">{commentsAmount}</p>
                  <p className="text-neutral-700 hover:black hover:underline">comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>)
      }
      {showComments &&
        (<div className="w-full flex flex-col">
          <CommentsArea postId={post._id} handleCommentsAmount={handleCommentsAmount}/>
        </div>)
      }
      {showLikes &&
        (<div className="w-full">
          <LikesArea postId={post._id} checkLiked={checkLiked}/>
        </div>)
      }
      {isDeleting &&
        <DeleteModal
          message={"Are you sure you want to delete this post?"}
          cancelFunction={toggleIsDeleting}
          deleteFunction={deletePost}
        />
      }
    </div>
  )
}

export default ImagePost;

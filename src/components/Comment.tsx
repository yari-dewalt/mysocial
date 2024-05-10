// @ts-nocheck
import type { Comment, User } from "../types.ts";

import OptionsModal from "./OptionsModal";
import DeleteModal from "./DeleteModal";

import likeIcon from "../assets/like.svg";
import likeIconFilled from "../assets/filled_like.svg";
import sendIcon from "../assets/send.svg";
import moreIcon from "../assets/more.svg";

import { AppContext } from "../App";

import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en"
TimeAgo.addDefaultLocale(en);

interface Props {
  comment: Comment,
  removeComment: () => void
}

function Comment({ comment, removeComment }: Props) {
  const timeAgo: TimeAgo = new TimeAgo("en-US");
  const { user }: User = useContext(AppContext);
  const [commentText, setCommentText] = useState<string>(comment.text);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [newReplyText, setNewReplyText] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(comment.edited);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(comment.likes.includes(user._id));
  const [numLikes, setNumLikes] = useState<number>(comment.likes.length);

  const isOwner: boolean = user._id == comment.user._id ? true : false;
  const MAX_CHAR_AMOUNT: number = 200;

  useEffect(() => {
    if (showReplies)
      fetchReplies();
  }, [showReplies])

  function handleReplies(newReply) {
    setReplies([...replies, newReply]);
  }

  function toggleReplies() {
    setShowReplies(!showReplies);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCommentText(e.target.value);
  }

  function toggleIsEditing(e: React.MouseEvent) {
    e.preventDefault();
    toggleShowOptions(e);
    setIsEditing(!isEditing);
    setCommentText(comment.text);
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewReplyText(e.target.value);
  }

  async function likeComment() {
    try {
      setIsLiked(true);
      setNumLikes(numLikes + 1);
      const response = await fetch(`https://mysocial-backend.onrender.com/comments/${comment._id}/like`,
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
        throw new Error("Liking comment failed");
      }
    } catch (error) {
      setIsLiked(false);
      console.log(error)
    }
  }

  async function unlikeComment() {
    try {
      setIsLiked(false);
      setNumLikes(numLikes - 1);
      const response = await fetch(`https://mysocial-backend.onrender.com/comments/${comment._id}/unlike`,
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
        throw new Error("Liking comment failed");
      }
    } catch (error) {
      setIsLiked(true);
      console.log(error);
    }
  }

  async function fetchReplies() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/comments/${comment._id}/replies`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      if (!response.ok) {
        throw new Error("Fetching replies failed");
      }

      const content = await response.json();
      setReplies(content);
    } catch (error) {
      console.log(error);
    }
  }

  async function postReply() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/comments/${comment._id}/replies`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({
            userId: user._id,
            text: newReplyText
        })
      });

      if (!response.ok) {
        throw new Error("Sending reply failed");
      }

      const content = await response.json();
      handleReplies(content);
      setNewReplyText("");
    } catch (error) {
      console.log(error);
    }
  }

  async function editComment(e: React.MouseEvent) {
    try {
      comment.text = commentText;
      setIsEdited(true);
      toggleIsEditing(e);
      toggleShowOptions(e);
      const response = await fetch(`https://mysocial-backend.onrender.com/comments/${comment._id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
          body: JSON.stringify({ text: commentText })});

      if (!response.ok) {
        throw new Error("Editing comment failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComment(e: React.MouseEvent) {
    try {
      removeComment(comment);
      toggleIsDeleting(e);
      toggleShowOptions(e);
      const response = await fetch(`https://mysocial-backend.onrender.com/comments/${comment._id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
          body: JSON.stringify({ postId: comment.post }
      )});

      if (!response.ok) {
        throw new Error("Deleting comment failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {comment.user &&
        (<div className="flex flex-col">
          <div className="flex justify-between max-w-full">
            <div className="flex gap-1 min-w-0">
              <Link to={`/users/${comment.user._id}`} className="min-w-8 min-h-8 max-w-8 max-h-8 rounded-full object-cover">
                <img src={comment.user.image} className="rounded-full object-cover min-w-7 w-7 min-h-7 h-7"></img>
              </Link>
              <div className="min-w-0 text-sm flex flex-col">
                <div className="flex items-center">
                  <Link to={`/users/${comment.user._id}`} className="font-medium hover:text-neutral-700">{comment.user.name}</Link>
                  <Link to={`/users/${comment.user._id}`} className="text-neutral-500 text-xs ml-1 mr-1 hover:text-neutral-600">{`@${comment.user.username}`}</Link>
                </div>
                {!isEditing &&
                  <p className="break-words">{commentText}</p>
                }
                {isEditing &&
                  <div className="flex flex-col gap-1">
                    <textarea onChange={handleEditChange} value={commentText} className="h-32 p-1 text-xl rounded border-2 border-sky-500 outline-none resize-none"></textarea>
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <button onClick={toggleIsEditing} className="p-1 bg-red-400 hover:bg-red-500 text-white font-medium rounded">Cancel</button>
                        {commentText.length <= MAX_CHAR_AMOUNT
                          ? <button onClick={editComment} className="p-1 bg-green-400 hover:bg-green-500 text-white font-medium rounded">Confirm</button>
                          : <button className="hover:cursor-default opacity-50 p-1 bg-green-400 text-white font-medium rounded">Confirm</button>
                        }
                      </div>
                      <p className="font-medium text-neutral-500"><span className={`font-normal ${commentText.length > MAX_CHAR_AMOUNT ? "text-red-500" : ""}`}>{commentText.length}</span>{` / ${MAX_CHAR_AMOUNT}`}</p>
                    </div>
                  </div>
                }
                <div className="flex gap-2 text-neutral-600 items-center">
                  <div className="flex gap-1 items-center">
                    <p>{timeAgo.format(new Date(comment.timestamp))}</p>
                    {isEdited && <p className="text-xs">(edited)</p>}
                  </div>
                  <p>{`${numLikes} likes`}</p>
                  <img onClick={isLiked ? unlikeComment : likeComment} src={isLiked ? likeIconFilled : likeIcon} alt="like button" className="hover:cursor-pointer min-w-5 w-5"></img>
                  <p onClick={toggleReplies} className="hover:cursor-pointer font-medium">Reply</p>
                </div>
              </div>
            </div>
            {isOwner &&
              <div className="relative">
                <img onClick={toggleShowOptions} src={moreIcon} alt="more options" className="min-w-6 hover:cursor-pointer opacity-65 hover:opacity-100"></img>
                {showOptions &&
                  <OptionsModal handleEditState={toggleIsEditing} handleDeleteState={toggleIsDeleting}/>
                }
              </div>
            }
          </div>
          {comment.replies.length > 0 && replies.length == 0 &&
            <div className="flex items-center gap-1 max-w-40">
              <div className="grow h-0.5 bg-neutral-400"></div>
              <p onClick={toggleReplies} className="hover:cursor-pointer text-xs text-neutral-500">{`${showReplies ? "Hide" : "Show"} ${replies.length == 0 ? comment.replies.length : replies.length} replies`}</p>
              <div className="grow h-0.5 bg-neutral-400"></div>
            </div>
          }
          {replies.length > 0 &&
            <div className="flex items-center gap-1 max-w-40">
              <div className="grow h-0.5 bg-neutral-400"></div>
              <p onClick={toggleReplies} className="hover:cursor-pointer text-xs text-neutral-500">{`${showReplies ? "Hide" : "Show"} ${replies.length == 0 ? comment.replies.length : replies.length} replies`}</p>
              <div className="grow h-0.5 bg-neutral-400"></div>
            </div>
          }
          {showReplies &&
            (<div className="flex flex-col pl-4">
              {replies.map((reply) => (
                <Comment key={reply._id} comment={reply}/>
              ))}
              <div className="mt-2 flex items-center gap-1">
                <img src={user.image} className="rounded-full object-cover min-w-7 w-7 min-h-7 h-7"></img>
                <div className="grow flex border border-neutral-400 rounded-lg focus-within:bg-neutral-200 transition-colors duration-50">
                  <form onSubmit={postReply} className="grow">
                    <input value={newReplyText} onChange={handleChange} placeholder={`Reply to ${comment.user.name} (${comment.user.username})`} className="w-full text-sm outline-none p-1 bg-transparent"></input>
                  </form>
                  {newReplyText.trim().length > 0
                    ? <img onClick={postReply} src={sendIcon} alt="send" className="min-w-3 hover:cursor-pointer"></img>
                    : <img src={sendIcon} alt="send" className="min-w-3 opacity-65"></img>
                  }
                </div>
              </div>
            </div>)
          }
        </div>)
      }
      {isDeleting &&
        <DeleteModal
          message={"Are you sure you want to delete this comment?"}
          cancelFunction={toggleIsDeleting}
          deleteFunction={deleteComment}
        />
      }
    </>
  )
}

export default Comment;

import Comment from "./Comment";
import UserCircle from "./UserCircle";

import sendIcon from "../assets/send.svg";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useContext, useEffect } from "react";

function CommentsArea({ postId, handleCommentsAmount }) {
  const { user } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const MAX_CHAR_AMOUNT = 500;

  useEffect(() => {
    fetchComments();
  }, []);

  function handleComments(newComment) {
    setComments([...comments, newComment]);
  }

  function removeComment(comment) {
    setComments(comments.filter(item => item._id != comment._id));
    handleCommentsAmount(comments.length - 1);
  }

  if (newCommentText.length > MAX_CHAR_AMOUNT)
    setNewCommentText(newCommentText.substring(0, 500));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewCommentText(e.target.value);
  }

  async function fetchComments() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${postId}/comments`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      if (!response.ok) {
        throw new Error("Fetching comments failed");
      }

      const content = await response.json();
      console.log(content);
      setComments(content);
      handleCommentsAmount(content.length);
    } catch (error) {
      console.log(error);
    }
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/posts/${postId}/comments`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({
            userId: user._id,
            text: newCommentText
        })
      });

      if (!response.ok) {
        throw new Error("Sending comment failed");
      }

      const content = await response.json();
      console.log(content);
      handleComments(content);
      setNewCommentText("");
      handleCommentsAmount(comments.length + 1);

      if (content.post.user != user._id)
        socket.emit("notify general", content.post.user);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div onClick={(e) => e.preventDefault()} className={`bg-white cursor-default ${comments.length > 0 ? "p-2" : ""} flex flex-col gap-2`}>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} removeComment={removeComment}/>
      ))}
      <div className={`mt-2 flex items-center gap-1 ${comments.length == 0 ? "p-2" : ""}`}>
        <img src={user.image} className="rounded-full object-cover min-w-7 w-7 min-h-7 h-7"></img>
        <div className="grow flex border border-neutral-400 rounded-lg focus-within:bg-neutral-200 transition-colors duration-50">
          <form onSubmit={postComment} className="grow">
            <input value={newCommentText} onChange={handleChange} placeholder="Add a comment..." className="w-full text-sm outline-none p-1 bg-transparent"></input>
          </form>
          {newCommentText.trim().length > 0
            ? <img onClick={postComment} src={sendIcon} alt="send" className="min-w-3 hover:cursor-pointer"></img>
            : <img src={sendIcon} alt="send" className="min-w-3 opacity-65"></img>
          }
        </div>
      </div>
    </div>
  )
}

export default CommentsArea;

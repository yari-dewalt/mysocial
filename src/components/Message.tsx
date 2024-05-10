import type { Message, User } from "../types.ts";

import OptionsModal from "./OptionsModal";
import DeleteModal from "./DeleteModal";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useContext } from "react";
import { format, differenceInDays } from "date-fns";
import TimeAgo from "javascript-time-ago";

function Message({ message }: Message) {
  const { user }: User = useContext(AppContext);
  const isSelf: boolean = (message.from._id == user._id) ? true : false;
  const timeAgo: TimeAgo = new TimeAgo("en-US");
  const messageTimeAgo: Date = differenceInDays(new Date(), message.edited ? new Date(message.lastEdited) : new Date(message.timestamp));
  let modifiedTimestamp: string = "";
  const [messageText, setMessageText] = useState<string>(message.text);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (messageTimeAgo < 1) {
    modifiedTimestamp = format(message.edited ? new Date(message.lastEdited) : new Date(message.timestamp), "h:mm aa");
  } else if (messageTimeAgo == 1) {
    modifiedTimestamp = "Yesterday";
  } else if (messageTimeAgo > 1) {
    modifiedTimestamp = timeAgo.format(message.edited ? new Date(message.lastEdited) : new Date(message.timestamp));
  }

  function toggleShowOptions() {
    setShowOptions(!showOptions);
  }

  function toggleIsEditing() {
    toggleShowOptions();
    setIsEditing(!isEditing);
    setMessageText(message.text);
  }

  function toggleIsDeleting() {
    setIsDeleting(!isDeleting);
  }

  function handleEditingChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessageText(e.target.value);
  }

  async function editMessage(e: React.MouseEvent) {
    e.preventDefault();
    message.text = messageText;
    message.edited = true;
    message.lastEdited = Date.now();
    socket.emit("edit message", message);
    setIsEditing(false);

    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/messages/${message._id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({
          text: messageText
        })
      });

      const content = await response.json();
      console.log(content);

      if (!response.ok) {
        throw new Error("Failed to edit message");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteMessage() {
    socket.emit("delete message", message);

    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/messages/${message._id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      console.log(content);

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className={`flex gap-2 ${isSelf ? "self-end" : ""}`} style={{ maxWidth: "80%" }}>
        {!isSelf &&
          <img src={message.from.image} className="rounded-full min-w-8 w-8 min-h-8 h-8 object-cover"></img>
        }
        <div className="flex flex-col relative">
          <div onClick={isSelf && !isEditing ? toggleShowOptions : () => {}} className={`w-fit p-2 rounded-2xl ${isSelf ? "bg-sky-600 self-end hover:cursor-pointer" : "bg-neutral-500"}`}>
            {!isEditing && <p className="text-white [overflow-wrap:anywhere]">{messageText}</p>}
            {isEditing &&
              (<div className="flex flex-col">
                <textarea onChange={handleEditingChange} value={messageText} className="h-16 bg-transparent outline-none text-white resize-none"></textarea>
              </div>)
            }
          </div>
          <div className={`flex gap-1 items-center ${isSelf ? "self-end" : ""}`}>
            {message.edited && <p className="text-neutral-600 text-xs">(edited)</p>}
            {isEditing &&
              <div className="flex justify-between mt-1">
                <div className="flex gap-1">
                  <button onClick={toggleIsEditing} className="p-1 bg-red-400 hover:bg-red-500 text-white font-medium rounded">Cancel</button>
                    <button onClick={editMessage} className="p-1 bg-green-400 hover:bg-green-500 text-white font-medium rounded">Confirm</button>
                </div>
              </div>
            }
            <p className={`text-neutral-600 text-sm`}>{modifiedTimestamp}</p>
          </div>
          {showOptions &&
            (<div className="absolute bottom-7 right-0">
              <OptionsModal handleEditState={toggleIsEditing} handleDeleteState={toggleIsDeleting}/>
            </div>)
          }
        </div>
      </div>
      {isDeleting &&
        <DeleteModal
          message={"Are you sure you want to delete this message?"}
          cancelFunction={toggleIsDeleting}
          deleteFunction={deleteMessage}
        />
      }
    </>
  )
}

export default Message;

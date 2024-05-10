// @ts-nocheck
import type { Notification } from "../types.ts";

import UserCircle from "./UserCircle";

import closeIcon from "../assets/close.svg";

import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";

interface Props {
  notification: Notification,
  onDelete: () => void
}

function Notification({ notification, onDelete }: Props) {
  const timeAgo: TimeAgo = new TimeAgo("en-US");

  function deleteNotification() {
    onDelete(notification);
  }

  function getNotificationContent() {
    switch (notification.type) {
      case "post":
        return (
          <Link to={`/posts/${notification.post}`} className="flex grow gap-2">
            <UserCircle user={notification.from} size={5}/>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <p className="break-words text-neutral-600">
                  <span><Link to={`/users/${notification.from._id}`} className="font-medium hover:text-neutral-700 text-black">{notification.from.name}</Link></span>
                  <span className="ml-1 mr-1"><Link to={`/users/${notification.from._id}`} className="text-neutral-500 hover:text-neutral-700 text-xs">{`(${notification.from.username})`}</Link></span>
                  {notification.text}
                </p>
              </div>
              <p className="text-sm text-neutral-500">{timeAgo.format(new Date(notification.timestamp))}</p>
            </div>
          </Link>
        );
      case "comment":
        return (
          <Link to={`/posts/${notification.post}`} className="flex grow gap-2">
            <UserCircle user={notification.from} size={5}/>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <p className="break-words">
                  <span><Link to={`/users/${notification.from._id}`} className="font-medium hover:text-neutral-700">{notification.from.name}</Link></span>
                  <span className="ml-1 mr-1"><Link to={`/users/${notification.from._id}`} className="text-neutral-500 hover:text-neutral-700 text-xs mr-1">{`(${notification.from.username})`}</Link><span className="text-neutral-600">commented on your post:</span></span>
                  {notification.text}
                </p>
              </div>
              <p className="text-sm text-neutral-500">{timeAgo.format(new Date(notification.timestamp))}</p>
            </div>
          </Link>
        );
      case "like":
        return (
          <Link to={`/posts/${notification.post}`} className="flex grow gap-2">
            <UserCircle user={notification.from} size={5}/>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <p className="break-words text-neutral-700">
                  <span><Link to={`/users/${notification.from._id}`} className="text-black font-medium hover:text-neutral-700">{notification.from.name}</Link></span>
                  <span className="ml-1 mr-1"><Link to={`/users/${notification.from._id}`} className="text-neutral-500 hover:text-neutral-700 text-xs">{`(${notification.from.username})`}</Link></span>
                  {notification.text}
                </p>
              </div>
              <p className="text-sm text-neutral-500">{timeAgo.format(new Date(notification.timestamp))}</p>
            </div>
          </Link>
        );
      case "message":
        return (
          <Link to={`/messages/${notification.conversation}`} className="flex grow gap-2">
            <UserCircle user={notification.from} size={5}/>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center min-w-0">
                <p className="break-words">
                  <span><Link to={`/users/${notification.from._id}`} className="font-medium hover:text-neutral-700">{notification.from.name}</Link></span>
                  <span className="ml-1 mr-1"><Link to={`/users/${notification.from._id}`} className="text-neutral-500 hover:text-neutral-700 text-xs mr-1">{`(${notification.from.username})`}</Link><span className="text-neutral-600">sent you a message:</span></span>
                  {notification.text}
                </p>
              </div>
              <p className="text-sm text-neutral-500">{timeAgo.format(new Date(notification.timestamp))}</p>
            </div>
          </Link>
        );
      case "follow":
        return (
          <Link to={`/users/${notification.from._id}`} className="flex grow gap-2">
            <UserCircle user={notification.from} size={5}/>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <p className="break-words text-neutral-600">
                  <span><Link to={`/users/${notification.from._id}`} className="text-black font-medium hover:text-neutral-700">{notification.from.name}</Link></span>
                  <span className="ml-1 mr-1"><Link to={`/users/${notification.from._id}`} className="text-neutral-500 hover:text-neutral-700 text-xs">{`(${notification.from.username})`}</Link></span>
                  {notification.text}
                </p>
              </div>
              <p className="text-sm text-neutral-500">{timeAgo.format(new Date(notification.timestamp))}</p>
            </div>
          </Link>
        );
    }
  }

  return (
    <div className="flex gap-1 items-center max-w-full justify-between p-2 hover:bg-gray-200">
      {getNotificationContent()}
      <img onClick={deleteNotification} src={closeIcon} alt="close" className="hover:opacity-65 hover:cursor-pointer min-w-4 w-4"></img>
    </div>
  )
}

export default Notification;

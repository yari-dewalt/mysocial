import type { Notification } from "../types.ts";

import Notification from "../components/Notification";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useContext, useEffect } from "react";

function Notifications() {
  const { user, handleUser, setLoadingProgress } = useContext(AppContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  function handleSocketEvent() {
    setTimeout(() => {
      fetchNotifications();
    }, 5000);
  }

  useEffect(() => {
    socket.on("notify general", handleSocketEvent);

    return () => {
      socket.off("notify general", handleSocketEvent);
    }
  })

  function handleNotifications(updatedNotifications) {
    setNotifications(updatedNotifications);
  }

  async function fetchNotifications() {
    try {
      setLoadingProgress(20);
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/notifications/`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();

      if (!response.ok) {
        throw new Error("Fetching notifications failed");
      }

      setLoadingProgress(100);
      setNotifications(content);
    } catch (error) {
      console.log(error);
      setLoadingProgress(0.001);
    }
  }

  async function deleteNotification(notification) {
    const updatedNotifications = notifications.filter(item => item._id != notification._id);
    handleNotifications(updatedNotifications)
    handleUser({...user, notifications: updatedNotifications});

    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${user._id}/notifications/${notification._id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      if (!response.ok) {
        throw new Error("Deleting notification failed");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grow flex flex-col max-h-screen min-w-0">
      <div className="flex justify-center bg-white p-2 shadow-sm border-b-2 border-neutral-200 text-neutral-800">
        <h1 className="text-2xl font-medium">Notifications</h1>
      </div>
      <div className="flex flex-col-reverse bg-white overflow-y-auto">
        {notifications.map((notification) =>
          (<Notification key={notification._id} notification={notification} onDelete={deleteNotification}/>)
        )}
      </div>
    </div>
  )
}

export default Notifications;

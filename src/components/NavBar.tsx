import type { User } from "../types.ts";

import NavItem from "./NavItem";
import ProfileModule from "./ProfileModule";

import homeIcon from "../assets/home.svg";
import selectedHomeIcon from "../assets/selected_home.svg";
import searchIcon from "../assets/search.svg";
import messagesIcon from "../assets/messages.svg";
import selectedMessagesIcon from "../assets/selected_messages.svg";
import notificationsIcon from "../assets/notifications.svg";
import selectedNotificationsIcon from "../assets/selected_notifications.svg";
import createIcon from "../assets/create.svg";
import selectedCreateIcon from "../assets/create_filled.svg";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";

function NavBar() {
  const [selected, setSelected] = useState<number>(0);
  const location = useLocation();
  const { user }: User = useContext(AppContext);
  const [numNotifications, setNumNotifications] = useState<number>(user.notifications.length);
  const [showProfileModule, setShowProfileModule] = useState<boolean>(false);
  const isPhone: boolean = useMediaQuery("(max-width: 610px)");

  function handleSocketEvent() {
    setTimeout(() => {
      increaseNumNotifications();
    }, 5000);
  }

  function increaseNumNotifications() {
    setNumNotifications(prevNumNotifications => prevNumNotifications + 1);
  }

  function toggleProfileModule() {
    setShowProfileModule(!showProfileModule);
  }

  function closeProfileModule() {
    setShowProfileModule(false);
  }

  useEffect(() => {
    if (location.pathname == "/") {
      setSelected(0);
    } else if (location.pathname.includes("/search")) {
      setSelected(1);
    } else if (location.pathname.includes("/messages")) {
      setSelected(2);
    } else if (location.pathname.includes("/notifications")) {
      setSelected(3);
    } else if (location.pathname.includes(user._id)) {
      setSelected(4);
    } else if (location.pathname.includes("/create")) {
      setSelected(5);
    } else {
      setSelected(-1);
    }
  }, [location]);

  useEffect(() => {
    socket.on("notify general", handleSocketEvent);

    return () => {
      socket.off("notify general", handleSocketEvent);
    }
  }, []);

  useEffect(() => {
    setNumNotifications(user.notifications.length);
  }, [user.notifications]);

  return (
    <div className="z-20 min-h-screen phone:min-h-0 shadow-[rgba(0,0,15,0.1)_1px_0px_0px_1px] relative bg-white sticky top-0 phone:bottom-0 h-fit min-w-64 flex flex-col gap-12 p-6 phone:pb-2 phone:items-center phone:flex-col-reverse phone:gap-1">
      <h1 className="text-3xl font-logo font-bold phone:text-xl">MySocial</h1>
      <div className="flex flex-col gap-9 w-full phone:flex-row phone:justify-between phone:items-center phone:gap-0">
        <div onClick={closeProfileModule} className="phone:order-1">
          <NavItem
            selectedImage={selectedHomeIcon}
            deselectedImage={homeIcon}
            text="Home"
            link={"/"}
            selected={selected === 0}
            imageSize={3}
            rounded={false}
          />
        </div>
        <div onClick={closeProfileModule} className="phone:order-2">
          <NavItem
            selectedImage={searchIcon}
            deselectedImage={searchIcon}
            text="Search"
            link={"/search"}
            selected={selected === 1}
            imageSize={3}
            rounded={false}
          />
        </div>
        <div onClick={closeProfileModule} className="phone:hidden phone:order-3">
          <NavItem
            selectedImage={selectedMessagesIcon}
            deselectedImage={messagesIcon}
            text="Messages"
            link={"/messages"}
            selected={selected === 2}
            imageSize={3}
            rounded={false}
          />
        </div>
        <div onClick={closeProfileModule} className="phone:order-5 relative">
          <NavItem
            selectedImage={selectedNotificationsIcon}
            deselectedImage={notificationsIcon}
            text="Notifications"
            link={"/notifications"}
            selected={selected === 3}
            imageSize={3}
            rounded={false}
          />
          {numNotifications > 0 &&
            (<div className="absolute bottom-0.5 left-4 rounded-full w-5 h-5 bg-white flex justify-center items-center">
              <div className="rounded-full w-4 h-4 bg-red-500 flex justify-center items-center">
                <p className="text-sm font-medium text-white">{numNotifications > 9 ? "9+" : numNotifications}</p>
              </div>
            </div>)
          }
        </div>
        <div className="phone:hidden">
          <NavItem
            selectedImage={user.image}
            deselectedImage={user.image}
            text="Profile"
            link={`/users/${user._id}`}
            selected={selected === 4}
            imageSize={3}
            rounded={true}
          />
        </div>
        <div onClick={closeProfileModule} className="phone:order-4">
          <NavItem
            selectedImage={selectedCreateIcon}
            deselectedImage={createIcon}
            text="Create"
            link={`/create/`}
            selected={selected === 5}
            imageSize={isPhone ? 5 : 3}
            rounded={false}
          />
        </div>
        {isPhone &&
          (<div onClick={toggleProfileModule} className="phone:order-5 hover:cursor-pointer">
            <img src={user.image} className="rounded-full min-w-10 min-h-10 w-10 h-10 object-cover"></img>
            <div className={`absolute top-0 right-0 -translate-y-full ${showProfileModule ? "block" : "hidden"}`}>
              <ProfileModule user={user}/>
            </div>
          </div>)
        }
      </div>
    </div >
  )
}

export default NavBar;

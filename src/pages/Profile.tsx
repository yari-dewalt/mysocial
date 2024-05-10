import UserCircle from "../components/UserCircle";
import PostsArea from "../components/PostsArea";

import cameraIcon from "../assets/camera.svg";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";

function Profile() {
  const params = useParams();
  const userId = params.userId;
  const navigate = useNavigate();
  const { user, handleUser, setLoadingProgress } = useContext(AppContext);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [bio, setBio] = useState<string>("");
  const [updatedBio, setUpdatedBio] = useState<string>("");
  const isPhone = useMediaQuery("(max-width: 610px)");

  const MAX_CHAR_AMOUNT = 200;

  useEffect(() => {
    fetchProfileData();
    fetchPosts();
  }, [params.userId]);

  async function fetchProfileData() {
    try {
      setLoadingProgress(20);
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${userId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      setProfileUser(content);
      if (content._id == user._id) {
        setIsSelf(true);
      }
      if (content.followers.includes(user._id)) {
        setIsFollowing(true);
      }
      if (content.bio) {
        setBio(content.bio);
        setUpdatedBio(content.bio);
      }
      console.log(content);

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      
      setLoadingProgress(100);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPosts() {
    try {
      console.log(Date.now());
      setLoadingProgress(20);
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${userId}/posts`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      const content = await response.json();
      setPosts(content);
      console.log(content);

      if (!response.ok) {
        throw new Error("Failed to fetch user's posts");
      }
      
      setLoadingProgress(100);
    } catch (error) {
      console.log(error);
    }
  }

  async function logOut() {
    try {
      setLoadingProgress(20);
      localStorage.removeItem("user");
      const response = await fetch("https://mysocial-backend.onrender.com/users/logout",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      }});

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Logout failed");
      }

      handleUser(null);
      setLoadingProgress(100);
    } catch (error) {
      console.log(error);
      setLoadingProgress(0.01);
    }
  }

  async function followUser() {
    try {
      setIsFollowing(true);

      const updatedProfileUser = profileUser;
      updatedProfileUser.followers.push(user._id);
      setProfileUser(updatedProfileUser);

      const response = await fetch(`https://mysocial-backend.onrender.com/users/${profileUser._id}/follow`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ senderId: user._id })
      });

      console.log(await response.json());

      if (!response.ok) {
        throw new Error("Follow request failed");
      }

      socket.emit("notify general", profileUser._id);
    } catch (error) {
      console.log(error);

      setIsFollowing(false);

      const updatedProfileUser = profileUser;
      const index = updatedProfileUser.followers.indexOf(user._id);
      if (index !== -1) {
        updatedProfileUser.followers.splice(index, 1);
        setProfileUser(updatedProfileUser);
      }
    }
  }

  async function unfollowUser() {
    try {
      setIsFollowing(false);

      const updatedProfileUser = profileUser;
      const index = updatedProfileUser.followers.indexOf(user._id);
      if (index !== -1) {
        updatedProfileUser.followers.splice(index, 1);
        setProfileUser(updatedProfileUser);
      }

      const response = await fetch(`https://mysocial-backend.onrender.com/users/${profileUser._id}/unfollow`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ senderId: user._id })
      });

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Unfollow request failed");
      }

    } catch (error) {
      console.log(error);

      setIsFollowing(true);

      const updatedProfileUser = profileUser;
      updatedProfileUser.followers.push(user._id);
      setProfileUser(updatedProfileUser);
    }
  }

  function toggleIsEditing() {
    setIsEditing(!isEditing);
    console.log(updatedBio);
    setBio(updatedBio);
  }

  function handleBioChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBio(e.target.value);
  }

  async function editBio() {
    try {
      setUpdatedBio(bio);
      console.log(bio);
      setIsEditing(false);
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${profileUser._id}/bio`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ bio: bio })
      });

      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Editing bio failed");
      }

    } catch (error) {
      console.log(error);
      setIsEditing(true);
    }
  }

  async function editImage(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("userImage", file);
    console.log(e.target.files[0]);

    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${profileUser._id}/image`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Editing image failed");
      }

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage() {
    try {
      const response = await fetch(`https://mysocial-backend.onrender.com/users/${profileUser._id}/startConversation`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({ senderId: user._id })
      });

      if (!response.ok) {
        throw new Error("Failed to start conversation");
      }

      const content = await response.json();
      console.log(content);

      navigate(`/messages/${content._id}`);
    } catch (error) {
      console.log(error);
    }
  }

  function handleUserCircleClick() {
    if (isSelf) {
      const uploadInput = document.getElementById("upload");
      uploadInput.click();
    }
  }

  return (
    <>
    {profileUser &&
      (<div className="grow flex flex-col items-center">
        <div className="flex gap-2 pt-4">
          <div onClick={handleUserCircleClick} className="h-fit group relative">
            <UserCircle user={profileUser} size={isPhone ? 8 : 16}/>
            {isSelf &&
               <input id="upload" name="upload" onChange={editImage} className="hidden" type="file" accept=".png, .jpg, .jpeg"></input>
            }
            {isSelf &&
              (<div className="hover:cursor-pointer rounded-full bg-neutral-600 p-2 flex justify-center items-center opacity-0 phone:opacity-100 group-hover:opacity-100 absolute bottom-0 right-0">
                <img src={cameraIcon} className="min-w-10 w-10 phone:min-w-5 phone:w-5 invert"></img>
              </div>)
            }
          </div>
          <div className="flex flex-col max-w-60">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold -mb-1">{profileUser.name}</h1>
              <h2 className="text-neutral-600">{profileUser.username}</h2>
            </div>
            <div className="flex gap-2 justify-between">
              <div className="flex gap-1">
                <p className="font-semibold">{profileUser.posts.length}</p>
                <p>posts</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">{profileUser.followers.length}</p>
                <Link to={`/users/${profileUser._id}/connections?tab=followers`} className="text-neutral-700 hover:text-black">followers</Link>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">{profileUser.following.length}</p>
                <Link to={`/users/${profileUser._id}/connections?tab=following`} className="text-neutral-700 hover:text-black">following</Link>
              </div>
            </div>
            {bio && !isEditing &&
              <h3 className="mt-1 break-words">{bio}</h3>
            }
            {isSelf && !isEditing &&
              <p onClick={toggleIsEditing} className="w-fit text-neutral-600 hover:text-neutral-800 hover:cursor-pointer">Edit Bio</p>
            }
            {isEditing &&
              (<div className="flex flex-col gap-1">
                <textarea value={bio} onChange={handleBioChange} className="h-20 p-1 rounded border-2 border-sky-500 outline-none resize-none"></textarea>
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <button onClick={toggleIsEditing} className="p-1 bg-red-400 hover:bg-red-500 text-white font-medium rounded">Cancel</button>
                    {bio.length <= MAX_CHAR_AMOUNT
                      ? <button onClick={editBio} className="p-1 bg-green-400 hover:bg-green-500 text-white font-medium rounded">Confirm</button>
                      : <button className="hover:cursor-default opacity-50 p-1 bg-green-400 text-white font-medium rounded">Confirm</button>
                    }
                  </div>
                  {bio && <p className="font-medium text-neutral-500"><span className={`font-normal ${bio.length > MAX_CHAR_AMOUNT ? "text-red-500" : ""}`}>{bio.length}</span>{` / ${MAX_CHAR_AMOUNT}`}</p>}
                </div>
              </div>)
            }
            {isSelf && <button onClick={logOut} className="p-2 rounded bg-red-500 text-white font-medium mt-4">Log out</button>}
            {!isSelf && !isFollowing && <button onClick={followUser} className="p-2 rounded bg-sky-500 text-white font-medium mt-4">Follow</button>}
            {!isSelf && isFollowing && <button onClick={unfollowUser} className="p-2 rounded bg-red-500 text-white font-medium mt-4">Unfollow</button>}
            {!isSelf && <button onClick={sendMessage} className="p-2 mt-1 rounded bg-slate-500 text-white font-medium">Send Message</button>}
          </div>
        </div>
        <PostsArea posts={posts}/>
      </div>)
    }
    </>
  )
}

export default Profile;

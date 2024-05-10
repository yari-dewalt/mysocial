import UserCircle from "../components/UserCircle";
import ImageViewer from "../components/ImageViewer";

import uploadIcon from "../assets/upload.svg";

import { socket } from "../socket";
import { AppContext } from "../App";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

function Create() {
  const [postText, setPostText] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File>([]);
  const { user, setLoadingProgress } = useContext(AppContext);
  const [isLoading ,setIsLoading] = useState<boolean>(false);
  const maxCharCount = 500;
  const navigate = useNavigate();

  function handleChangeText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setPostText(e.target.value);
  }

  function addImages(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);

      const imageUrls = newFiles.map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...imageUrls]);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const fileList = e.dataTransfer.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);

      const imageUrls = newFiles.map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...imageUrls]);
    }
  }
  async function createPost() {
    setIsLoading(true);
    setLoadingProgress(20);

    const formData = new FormData();
    formData.append("userId", user._id);
    if (postText)
      formData.append("text", postText);
    files.forEach(file => {
      formData.append("postImages", file);
    })

    try {
      const response = await fetch("https://mysocial-backend.onrender.com/posts",
      {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Creating post failed");
      }

      const content = await response.json();
      console.log(content);
      
      setIsLoading(false);
      setLoadingProgress(100);
      navigate(`/posts/${content._id}`);

      for (let i = 0; i < user.followers.length; i++) {
        socket.emit("notify post", user.followers[i]);
        socket.emit("notify general", user.followers[i]);
      }

    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setLoadingProgress(0.001);
    }
  }

  return (
    <div className="grow flex flex-col items-center p-10 phone:p-4 phone:justify-center">
      <div className="flex flex-col gap-2 items-center p-2 pb-6 w-5/6 phone:w-full max-w-[40rem] shadow-lg">
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="group flex flex-col gap-2 w-full h-56 items-center justify-center bg-neutral-200">
          <img src={uploadIcon} className="min-w-20"></img>
          <h2 className="font-bold text-xl text-neutral-500 group-hover:text-neutral-700 text-center">Drag and drop your images here</h2>
          <p className="text-sm text-neutral-500">(png, jpg, jpeg)</p>
          <p className="font-medium text-neutral-500">or</p>
          <label htmlFor="upload" className="hover:cursor-pointer font-bold text-sky-500 p-2 pl-5 pr-5 border-2 border-sky-500 opacity-80 hover:opacity-100 rounded">Browse files</label>
          <input id="upload" name="upload" className="hidden" type="file" accept=".png, .jpg, .jpeg" multiple onChange={addImages}></input>
        </div>
        <div className="self-start flex gap-2 items-center pt-2 pb-2">
          <UserCircle user={user} size={4}/>
          <div className="flex gap-1 items-center">
            <Link to={`/users/${user._id}`} className="hover:text-neutral-700 font-bold">{user.name}</Link>
            <Link to={`/users/${user._id}`} className="text-neutral-500 hover:text-neutral-600 text-sm">{`@${user.username}`}</Link>
          </div>
        </div>
        {images.length > 0 &&
          (<div className="grow flex justify-center items-center w-full h-3/4">
            <ImageViewer images={images}/>
          </div>)
        }
        <div className="flex flex-col w-full">
          <textarea className="outline-none rounded-sm border-2 border-black border-opacity-50 focus:border-opacity-70 p-2 resize-none h-40 w-full" value={postText} onChange={handleChangeText} placeholder="Enter post text"></textarea>
          <p className="self-end font-medium text-neutral-500"><span className={`font-normal ${postText.length > maxCharCount ? "text-red-500" : ""}`}>{postText.length}</span>{` / ${maxCharCount}`}</p>
        </div>
        {images.length > 0 || (postText && (postText.length <= maxCharCount)) && !isLoading
          ? (<div onClick={createPost} className={`hover:cursor-pointer relative opacity-100 rounded p-1 bg-gradient-to-bl from-violet-500 to-yellow-400 from-20%`}>
              <button disabled={isLoading} className="bg-white text-lg p-2 pl-5 pr-5 rounded font-bold">Post</button>
            </div>)
          : (<div className={`relative opacity-50 rounded p-1 bg-gradient-to-bl from-violet-500 to-yellow-400 from-20%`}>
              <button disabled={true} className="hover:cursor-default bg-white text-lg p-2 pl-5 pr-5 rounded font-bold">Post</button>
            </div>)
        }
      </div>
    </div>
  )
}

export default Create;

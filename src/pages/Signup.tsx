// @ts-nocheck
import backgroundImage from "../assets/background.jpg";

import { AppContext } from "../App";

import { socket } from "../socket";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

interface FormData {
  name: string;
  username: string;
  password: string;
  confirmpassword: string;
}

function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    password: "",
    confirmpassword: ""
  });
  const [error, setError] = useState<string>("");
  const { handleUser, setLoadingProgress } = useContext(AppContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  async function sendSignupRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoadingProgress(20);

    if (formData.password != formData.confirmpassword) {
      setError("Passwords do not match");
      setLoadingProgress(0.001);
      return;
    }

    try {
      const response = await fetch("https://mysocial-backend.onrender.com/users/signup",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }
      
      const { newUser } = await response.json();
      handleUser(newUser);
      socket.emit("assign id", parsedUser._id);
      localStorage.setItem("user", JSON.stringify(newUser));
      setError("");
      setLoadingProgress(100);
    } catch (error) {
      console.log(error);
      setError("Username is already taken.");
      setLoadingProgress(0.001);
    }
  }

  return (
    <div className="grow flex justify-center items-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="flex flex-col w-[24rem] phone:w-80 gap-2 bg-white">
        <div className="flex flex-col items-center border gap-6 border-black border-opacity-25 p-12 pb-6">
          <h1 className="select-none hover:cursor-pointer mb-8 text-5xl font-bold font-logo">MySocial</h1>
          <form onSubmit={sendSignupRequest} className="w-full flex flex-col gap-1.5">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" className="text-sm h-9 outline-none border border-black border-opacity-25 p-1 pl-2 pr-2 rounded"></input>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Username" className="text-sm h-9 outline-none border border-black border-opacity-25 p-1 pl-2 pr-2 rounded"></input>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="text-sm h-9 outline-none border border-black border-opacity-25 p-1 pl-2 pr-2 rounded"></input>
            <input type="password" name="confirmpassword" value={formData.confirmpassword} onChange={handleChange} required placeholder="Confirm password" className="text-sm h-9 outline-none border border-black border-opacity-25 p-1 pl-2 pr-2 rounded"></input>
            {(formData.name && formData.username && formData.password && formData.confirmpassword)
              ? <button type="submit" className="outline-none font-bold text-white bg-sky-500 p-1 rounded-lg mt-2">Sign up</button>
              : <button className="hover:cursor-default outline-none font-bold text-white bg-sky-400 p-1 rounded-lg mt-2">Sign up</button>
            }
            {error && <p className="text-xs text-red-400 text-center -mb-2">{error}</p>}
          </form>
        </div>
        <div className="flex justify-center border border-black border-opacity-25 p-5">
          <div className="flex gap-1 items-center">
            <p>Aleady have an account?</p>
            <Link to="/login" className="font-bold text-sky-500">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup;

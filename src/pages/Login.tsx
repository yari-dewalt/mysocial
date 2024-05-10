import backgroundImage from "../assets/background.jpg";

import { AppContext } from "../App";

import { socket } from "../socket";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

function Login() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: ""
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

  async function sendLoginRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoadingProgress(20);

    try {
      const response = await fetch("https://mysocial-backend.onrender.com/users/login",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const { user } = await response.json();
      console.log(user);
      handleUser(user);
      socket.emit("assign id", parsedUser._id);
      localStorage.setItem("user", JSON.stringify(user));
      setError("");
      setLoadingProgress(100);
    } catch (error) {
      console.log(error);
      setError("Username and password does not exist");
      setLoadingProgress(0.001);
    }
  }

  async function loginToDummyAccount() {
    setLoadingProgress(20);

    try {
      const response = await fetch("https://mysocial-backend.onrender.com/users/login",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({
            username: "dummyaccount",
            password: "password"
          })
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const { user } = await response.json();
      console.log(user);
      handleUser(user);
      socket.emit("assign id", parsedUser._id);
      localStorage.setItem("user", JSON.stringify(user));
      setError("");
      setLoadingProgress(100);
    } catch (error) {
      console.log(error);
      setError("Username and password does not exist");
      setLoadingProgress(0.001);
    }
  }

  return (
    <div className="grow flex justify-center items-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="flex flex-col w-[24rem] phone:w-80 gap-2 bg-white">
        <div className="flex flex-col items-center border gap-6 border-black border-opacity-25 p-12 pb-6">
          <h1 className="select-none hover:cursor-pointer mb-8 text-5xl font-bold font-logo">MySocial</h1>
          <form onSubmit={sendLoginRequest} className="w-full flex flex-col gap-1.5">
            <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Username" className="text-sm h-9 outline-none border border-black border-opacity-25 p-1 pl-2 pr-2 rounded"></input>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="text-sm h-9 outline-none border border-black border-opacity-25 p-1 pl-2 pr-2 rounded"></input>
            {(formData.username && formData.password)
              ? <button type="submit" className="outline-none font-bold text-white bg-sky-500 p-1 rounded-lg mt-2">Log in</button>
              : <button className="hover:cursor-default outline-none font-bold text-white bg-sky-400 p-1 rounded-lg mt-2">Log in</button>
            }
            {error && <p className="text-xs text-red-400 text-center -mb-2">{error}</p>}
          </form>
          <div className="w-full flex items-center gap-4">
            <div className="w-full h-0.5 bg-black opacity-15"></div>
            <p className="font-semibold opacity-60">OR</p>
            <div className="w-full h-0.5 bg-black opacity-15"></div>
          </div>
          <p onClick={loginToDummyAccount} className="text-neutral-500 hover:text-neutral-600 hover:cursor-pointer">Log in to a dummy account</p>
        </div>
        <div className="flex justify-center border border-black border-opacity-25 p-5">
          <div className="flex gap-1 items-center">
            <p>Don't have an account?</p>
            <Link to="/signup" className="font-bold text-sky-500">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;

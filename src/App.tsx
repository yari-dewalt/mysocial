import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Search from "./pages/Search";
import Messages from "./pages/Messages";
import Post from "./pages/Post";
import Connections from "./pages/Connections";
import Notifications from "./pages/Notifications";
import LoadingBar from "react-top-loading-bar";

import { socket } from "./socket";
import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

export const AppContext = createContext<{
  user: any; // Specify the type of user here
  handleUser: React.Dispatch<React.SetStateAction<any>>; // Type for setUser
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>; // Type for setLoadingProgress
}>({
  user: null,
  handleUser: () => {},
  setLoadingProgress: () => {}
});

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(socket.connected);

  function handleUser(newUserData) {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  }

  useEffect(() => {
    // Function to fetch profile data when component mounts
    const fetchProfileData = async (userId: string) => {
      try {
        const response = await fetch(`https://mysocial-backend.onrender.com/users/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const content = await response.json();
        setUser(content);
        localStorage.setItem("user", JSON.stringify(content));
        console.log(content);
      } catch (error) {
        console.log(error);
      }
    };

    socket.connect(); // Connect

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);


    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Fetch profile data using stored user's ID
      if (parsedUser != null) {
        fetchProfileData(parsedUser._id);
        socket.emit("assign id", parsedUser._id);
      }
    } else {
      // No stored user, set user to null
      setUser(null);
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    }
  }, []); // Empty dependency array to run effect only once

  return (
    <AppContext.Provider value={{ user, handleUser, setLoadingProgress }}>
      <div className="flex min-h-screen phone:flex-col-reverse bg-neutral-200">
        <Router>
          <LoadingBar
            color="linear-gradient(90deg, rgba(197,0,255,1) 40%, rgba(246,255,0,1) 100%)"
            progress={loadingProgress}
            onLoaderFinished={() => setLoadingProgress(0)}
            waitingTime={500}
          />
          {user && <NavBar/>}
          <Routes>
            <Route path="/" element={user ? <Home/> : <Navigate to="/login"/>}/>
            <Route path="/users/:userId" element={user ? <Profile/> : <Navigate to="/login"/>}/>
            <Route path="/users/:userId/connections" element={user ? <Connections/> : <Navigate to="/login"/>}/>
            <Route path="/posts/:postId" element={user ? <Post/> : <Navigate to="/login"/>}/>
            <Route path="/search" element={user ? <Search/> : <Navigate to="/login"/>}/>
            <Route path="/messages" element={user ? <Messages/> : <Navigate to="/login"/>}/>
            <Route path="/messages/:conversationId" element={user ? <Messages/> : <Navigate to="/login"/>}/>
            <Route path="/notifications" element={user ? <Notifications/> : <Navigate to="/login"/>}/>
            <Route path="/create" element={user ? <Create/> : <Navigate to="/login"/>}/>
            <Route path="/login" element={!user ? <Login/> : <Navigate to="/"/>}/>
            <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/"/>}/>
          </Routes>
        </Router>
      </div>
    </AppContext.Provider>
  )
}

export default App;

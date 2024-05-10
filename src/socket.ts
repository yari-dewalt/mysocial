import { io } from "socket.io-client";

const URL: string = "https://mysocial-backend.onrender.com";

export const socket = io(URL);

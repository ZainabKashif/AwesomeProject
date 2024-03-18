import { createContext, useState, useEffect } from "react";
import {io} from 'socket.io-client';
const ENDPOINT = "http://10.0.2.2:4000";

const UserType = createContext();

const UserContext = ({ children, selectedChatCompare }) => {
    const [userId, setUserId] = useState("");
    const [socket, setSocket] = useState(null);
    const [selectedChat, setSelectedChat] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);
      
        // Clean up the socket connection when the component unmounts
        return () => {
          newSocket.disconnect();
        };
      }, []);


      useEffect(() => {
        if (socket) {
          socket.emit("setup", userId);
      
          // Listen for connection event
          socket.on("connected", () => {
            setSocketConnected(true);
          });
      
          // Handle disconnection
          socket.on("disconnect", () => {
            setSocketConnected(false);
          });
        }
      }, [socket, userId]);

      useEffect(() => {
        if (selectedChatCompare) {
          console.log(selectedChatCompare._id);
        }
      }, [selectedChatCompare]);

      useEffect(() => {
        if (socket) {
          socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
              // give notification
              if (!notification.includes(newMessageReceived)){
                setNotification([newMessageReceived, ...notification]);
              }
    
            } else {
            console.log("they are talking alr");
            }
          });
        }
      }, [socket, selectedChatCompare, notification]); 


    return (
        <UserType.Provider value={{ userId, setUserId, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </UserType.Provider>
    );
}

export { UserType, UserContext }

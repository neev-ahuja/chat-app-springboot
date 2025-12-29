import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);


const SocketProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/websocket`),

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("STOMP Connected");
        setIsConnected(true);
        setClient(stompClient);
      },

      onDisconnect: () => {
        console.log("STOMP Disconnected");
        setIsConnected(false);
        setClient(null);
      },

      onStompError: (frame) => {
        console.error("Broker error", frame);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ stompClient: client, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

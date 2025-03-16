import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

// Singleton instance
let socket: Socket | null = null;

export const initSocket = async (): Promise<Socket> => {
  if (socket) {
    return socket;
  }

  const options: Partial<ManagerOptions & SocketOptions> = {
    forceNew: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    timeout: 20000,
    transports: ['websocket', 'polling'],
    autoConnect: false,
  };

  socket = io(import.meta.env.VITE_API_URL, options);

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

import { ACTIONS } from '@/constants/actions';
import { useUser } from '@/context/user-context';
import { disconnectSocket, initSocket } from '@/utils/socket';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';

const EditorPage = () => {
  const socketRef = useRef<Socket | null>(null);
  const { id } = useParams();
  const { userDetails } = useUser();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Only initialize if we don't have a socket or if it's not connected
        if (!socketRef.current || !socketRef.current.connected) {
          const socket = await initSocket();
          if (!mounted) return;

          socketRef.current = socket;

          // Remove any existing listeners before adding new ones
          socket.removeAllListeners();

          socket.connect();

          socket.on('connect', () => {
            if (!mounted) return;
            console.log('connected');
            toast.success('Connected to the socket server', {
              style: {
                backgroundColor: 'green',
                color: 'white',
              },
            });

            // Only emit join after successful connection
            socket.emit(ACTIONS.JOIN, {
              id,
              username:
                userDetails?.name ||
                userDetails?.githubUsername ||
                'Unknown User',
              userId: userDetails?.id,
            });
          });

          socket.on('connect_error', err => {
            if (!mounted) return;
            toast.error('Error on trying to connect to the socket server', {
              description: err.message,
              style: {
                backgroundColor: 'red',
                color: 'white',
              },
            });
          });

          // Check if someone joined the room
          socket.on(ACTIONS.JOINED, ({ username, userId }) => {
            if (!mounted) return;
            if (userDetails?.id !== userId) {
              toast.success(`${username} joined the room`, {
                position: 'top-center',
                style: {
                  backgroundColor: 'green',
                  color: 'white',
                },
              });
            }
          });

          // Check if someone left the room
          socket.on(ACTIONS.DISCONNECTED, ({ username, userId }) => {
            if (!mounted) return;
            if (userDetails?.id !== userId) {
              toast.success(`${username} left the room`, {
                position: 'top-center',
                style: {
                  backgroundColor: 'orangered',
                  color: 'white',
                },
              });
            }
          });
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Socket initialization error:', err);
        toast.error('Failed to initialize socket connection');
      }
    };

    init();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        disconnectSocket();
      }
    };
  }, [id, userDetails?.githubUsername, userDetails?.id, userDetails?.name]);

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={e => {
          e.preventDefault();
          socketRef.current?.emit(ACTIONS.LEAVE, {
            id,
            username:
              userDetails?.name ||
              userDetails?.githubUsername ||
              'Unknown User',
            userId: userDetails?.id,
          });
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Leave
      </button>
    </div>
  );
};

export default EditorPage;

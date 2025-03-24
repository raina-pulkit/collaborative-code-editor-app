import EditorSidebar from '@/components/editor-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ACTIONS } from '@/constants/actions';
import { useUser } from '@/context/user-context';
import { Editor } from '@monaco-editor/react';
import { disconnectSocket, initSocket } from '@/utils/socket';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { validate } from 'uuid';
import { handleEmitTyping } from '@/utils/emit-typing';
import { TYPING_DEBOUNCE } from '@/constants/utils';

const EditorPage = () => {
  const socketRef = useRef<Socket | null>(null);
  const { id = '' } = useParams();
  const { userDetails } = useUser();
  const [connectedUsers, setConnectedUsers] = useState<
    { userName: string; avatarUrl: string; userId: string }[]
  >([]);
  const navigate = useNavigate();
  let lastTyping: Date | null = null;
  const firstTime = useRef(true);

  useEffect(() => {
    if (!validate) {
      toast.error('Invalid room ID', {
        description: 'Please enter a valid room ID',
        style: {
          backgroundColor: 'red',
          color: 'white',
        },
      });
      navigate('/');
      return;
    }
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
            console.log('first time: =', firstTime.current);
            if (!mounted || !firstTime.current) return;
            toast.success('Connected to the socket server', {
              style: {
                backgroundColor: 'green',
                color: 'white',
              },
            });

            // Only emit join after successful connection
            socket.emit(ACTIONS.JOIN, {
              id,
              userName:
                userDetails?.name ||
                userDetails?.githubUsername ||
                'Unknown User',
              userId: userDetails?.id,
              avatarUrl: userDetails?.avatarUrl,
            });
            console.log('first time made false');
            firstTime.current = false;
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
          socket.on(ACTIONS.JOINED, ({ clients, userName, userId }) => {
            if (!mounted) return;
            if (userDetails?.id !== userId) {
              toast.success(`${userName} joined the room`, {
                position: 'top-center',
                style: {
                  backgroundColor: 'green',
                  color: 'white',
                },
              });
            }

            setConnectedUsers(clients);
          });

          // Check if someone left the room
          socket.on(ACTIONS.DISCONNECTED, ({ userName, userId }) => {
            if (!mounted) return;
            if (userDetails?.id !== userId) {
              toast.success(`${userName} left the room`, {
                position: 'top-center',
                style: {
                  backgroundColor: 'orangered',
                  color: 'white',
                },
              });
            }

            setConnectedUsers(prev =>
              prev.filter(user => user.userId !== userId),
            );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    userDetails?.avatarUrl,
    userDetails?.githubUsername,
    userDetails?.id,
    userDetails?.name,
  ]);

  return (
    <SidebarProvider>
      <EditorSidebar
        connectedUsers={connectedUsers}
        roomId={id || ''}
        socketRef={socketRef}
      />
      <SidebarTrigger className="cursor-pointer hover:scale-110 transition-all duration-300" />
      <Editor
        height="100vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onChange={e => {
          console.log('new text: ', e);
          if (
            !lastTyping ||
            new Date().getTime() - lastTyping.getTime() > TYPING_DEBOUNCE
          ) {
            handleEmitTyping(socketRef, id, userDetails?.id || '');
            lastTyping = new Date();
          }
        }}
      />
      ;
    </SidebarProvider>
  );
};

export default EditorPage;

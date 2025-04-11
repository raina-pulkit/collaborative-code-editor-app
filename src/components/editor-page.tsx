import { EditorSidebar } from '@/components/editor-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ACTIONS } from '@/constants/actions';
import { ROUTES } from '@/constants/routes';
import { LANGUAGE_OPTIONS } from '@/constants/sidebar-options';
import { TYPING_DEBOUNCE } from '@/constants/utils';
import { useUser } from '@/context/user-context';
import { languageAtom, themeAtom } from '@/jotai/atoms';
import { Room } from '@/types/room';
import { handleEmitTyping } from '@/utils/emit-typing';
import { disconnectSocket, initSocket } from '@/utils/socket';
import { Editor } from '@monaco-editor/react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { validate } from 'uuid';

const EditorPage = ({ room }: { room: Room }) => {
  const socketRef = useRef<Socket | null>(null);
  const codeRef = useRef<string>('// some comment');
  const [editorContent, setEditorContent] = useState<string>('// some comment');
  const { id = '' } = useParams();
  const { userDetails } = useUser();
  const [connectedUsers, setConnectedUsers] = useState<
    { userName: string; avatarUrl: string; userId: string }[]
  >([]);
  const navigate = useNavigate();
  const lastTypingRef = useRef<Date | null>(null);
  const firstTime = useRef(true);
  const [language, setLanguage] = useAtom(languageAtom);
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    if (!validate(id)) {
      toast.error('Invalid room ID', {
        description: 'Please enter a valid room ID',
        style: {
          backgroundColor: 'red',
          color: 'white',
        },
      });
      navigate(ROUTES.HOME);
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

            socket.emit(ACTIONS.CODE_CHANGE, {
              id,
              code: undefined,
            });
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
          socket.on(ACTIONS.JOINED, ({ clients, userName, userId, code }) => {
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
            if (code !== undefined) {
              setEditorContent(code);
            }
          });

          // Check if someone left the room
          socket.on(ACTIONS.DISCONNECTED, ({ userName, userId }) => {
            if (!mounted) return;

            setConnectedUsers(prev => {
              // Only show toast if user was in the list
              const userWasConnected = prev.some(
                user => user.userId === userId,
              );
              if (userWasConnected) {
                toast.success(`${userName} left the room`, {
                  position: 'top-center',
                  style: {
                    backgroundColor: 'orangered',
                    color: 'white',
                  },
                });
              }

              return prev.filter(user => user.userId !== userId);
            });
          });

          socket.on(ACTIONS.SYNC_CODE, ({ code }) => {
            codeRef.current = code;
            setEditorContent(code);
          });

          socket.on(ACTIONS.LANGUAGE_CHANGE_HANDLE, ({ language }) => {
            setLanguage({
              ...language,
              currValue: language,
              currLabel:
                LANGUAGE_OPTIONS.find(item => item.value === language)?.label ||
                language.defaultLabel,
            });
          });
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Socket initialization error:', err);
        toast.error('Failed to initialize socket connection');
      }
    };

    init();

    setLanguage({
      ...language,
      currValue: room.lastLanguage,
      currLabel:
        LANGUAGE_OPTIONS.find(item => item.value === room.lastLanguage)
          ?.label || language.defaultLabel,
    });

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
    navigate,
    room.lastLanguage,
  ]);

  return (
    <SidebarProvider
      style={{
        backgroundColor: theme.currValue === 'vs-dark' ? '#1e1e1e' : 'white',
      }}
    >
      <EditorSidebar
        connectedUsers={connectedUsers}
        roomId={id || ''}
        socketRef={socketRef}
        room={room}
      />
      <SidebarTrigger
        className="cursor-pointer hover:scale-110 transition-all duration-300"
        style={{
          color: theme.currValue === 'vs-dark' ? 'white' : 'black',
        }}
      />
      <Editor
        height="100vh"
        language={language.currValue}
        theme={theme.currValue}
        defaultValue="// some comment"
        value={editorContent}
        onChange={e => {
          if (e === undefined) return;

          if (
            !lastTypingRef.current ||
            new Date().getTime() - lastTypingRef.current.getTime() >
              TYPING_DEBOUNCE
          ) {
            handleEmitTyping(socketRef, id, userDetails?.id || '');

            lastTypingRef.current = new Date();
          }

          socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
            id,
            code: e,
          });
          codeRef.current = e;
          setEditorContent(e);
        }}
        options={{
          wordWrap: 'on',
        }}
      />
      ;
    </SidebarProvider>
  );
};

export default EditorPage;

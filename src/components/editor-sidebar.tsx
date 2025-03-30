import { ACTIONS } from '@/constants/actions';
import { ROUTES } from '@/constants/routes';
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from '@/constants/sidebar-options';
import { TYPING_DEBOUNCE } from '@/constants/utils';
import { useUser } from '@/context/user-context';
import { languageAtom, themeAtom } from '@/jotai/atoms';
import { initSocket } from '@/utils/socket';
import { Box } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from './ui/sidebar';

const LogoComponent = () => (
  <SidebarGroup>
    <SidebarGroupLabel className="text-2xl font-bold text-black w-full flex justify-center items-center mb-4">
      Code Editor OP
    </SidebarGroupLabel>
    <SidebarGroupContent>
      <img
        src="/src/assets/cool-editor.jpeg"
        alt="Image"
        className="inset-0 dark:brightness-[0.2] dark:grayscale rounded-full"
      />
    </SidebarGroupContent>
  </SidebarGroup>
);

const CurrentlyConnectedUsers = ({
  connectedUsers,
}: {
  connectedUsers: {
    userName: string;
    avatarUrl: string;
    userId: string;
  }[];
}) => (
  <SidebarGroup>
    <SidebarGroupLabel>Connected</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {connectedUsers.slice(0, 5).map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <Box>
                <Avatar>
                  <AvatarImage src={item.avatarUrl} />
                  <AvatarFallback>{item.userName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{item.userName}</span>
              </Box>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {connectedUsers.length > 5 && (
          <Popover>
            <PopoverTrigger className="cursor-pointer">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span>+{connectedUsers.length - 5} more</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </PopoverTrigger>

            <PopoverContent className="min-w-16 w-[--radix-popover-trigger-width] list-none p-2">
              {connectedUsers.slice(5).map((item, index) => (
                <SidebarMenuItem key={index} className="list-none">
                  <SidebarMenuButton asChild>
                    <Box>
                      <Avatar>
                        <AvatarImage src={item.avatarUrl} />
                        <AvatarFallback>
                          {item.userName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.userName}</span>
                    </Box>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

const LanguageSelector = () => {
  const [lang, setLang] = useAtom(languageAtom);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Select Language:</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Select
            onValueChange={value => {
              setLang({
                ...lang,
                currValue: value,
                currLabel:
                  LANGUAGE_OPTIONS.find(item => item.value === value)?.label ||
                  lang.defaultValue,
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                defaultValue={lang.defaultValue}
                placeholder={lang.defaultLabel}
              />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const ThemeSelector = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Select Theme:</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Select
            onValueChange={value => {
              setTheme({
                ...theme,
                currValue: value,
                currLabel:
                  LANGUAGE_OPTIONS.find(item => item.value === value)?.label ||
                  theme.defaultValue,
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                defaultValue={theme.defaultValue}
                placeholder={theme.defaultLabel}
              />
            </SelectTrigger>
            <SelectContent>
              {THEME_OPTIONS.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const EditorSidebar = ({
  connectedUsers,
  roomId,
  socketRef,
}: {
  connectedUsers: {
    userName: string;
    avatarUrl: string;
    userId: string;
  }[];
  roomId: string;
  socketRef: React.RefObject<Socket | null>;
}) => {
  const { userDetails } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (!socketRef?.current) {
        socketRef.current = await initSocket();
        socketRef.current.connect();

        socketRef.current.on('connect', () => {
          toast.success('Connected to the socket server', {
            style: {
              backgroundColor: 'green',
              color: 'white',
            },
          });

          // Only emit join after successful connection
          socketRef.current?.emit(ACTIONS.JOIN, {
            id: roomId,
            userName:
              userDetails?.name ||
              userDetails?.githubUsername ||
              'Unknown User',
            userId: userDetails?.id,
            avatarUrl: userDetails?.avatarUrl,
          });
        });
      }

      socketRef.current.on(
        ACTIONS.SOMEONE_TYPING,
        ({ userName, userId }: { userName: string; userId: string }) => {
          if (userId !== userDetails?.id) {
            toast.info(`${userName} is typing...`, {
              style: {
                backgroundColor: 'blue',
                color: 'white',
              },
              duration: TYPING_DEBOUNCE,
            });
          }
        },
      );
    };
    init();

    return () => {
      // Cleanup
      socketRef.current?.removeListener(ACTIONS.SOMEONE_TYPING);
    };
  });

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col gap-4 p-4 items-center overflow-x-hidden">
        <LogoComponent />

        <SidebarSeparator />

        <CurrentlyConnectedUsers connectedUsers={connectedUsers} />

        <SidebarSeparator />

        <LanguageSelector />
        <ThemeSelector />

        <SidebarSeparator />

        <Button
          className="border-none p-2.5 rounded-2xl text-md font-bold cursor-pointer transition-all ease-in-out duration-300 bg-white text-black hover:text-white"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(roomId);
              toast.success('Room ID has been copied to clipboard');
            } catch (err) {
              toast.error('Could not copy the Room ID');
              console.error(err);
            }
          }}
        >
          Copy Room ID
        </Button>

        <SidebarSeparator />

        <Button
          className="border-none p-2.5 rounded-2xl text-md font-bold cursor-pointer transition-all ease-in-out duration-300 bg-red-400 text-black hover:text-white"
          onClick={async e => {
            e.preventDefault();
            socketRef.current?.emit(ACTIONS.LEAVE, {
              id: roomId,
              userName:
                userDetails?.name ||
                userDetails?.githubUsername ||
                'Unknown User',
              userId: userDetails?.id,
            });
            toast.success('You have left the room');
            navigate(ROUTES.HOME);
          }}
        >
          Leave Room
        </Button>
      </SidebarContent>
    </Sidebar>
  );
};

export default EditorSidebar;

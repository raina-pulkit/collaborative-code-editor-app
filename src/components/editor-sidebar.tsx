import { ACTIONS } from '@/constants/actions';
import { ROUTES } from '@/constants/routes';
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from '@/constants/sidebar-options';
import { useUser } from '@/context/user-context';
import { useEndRoom } from '@/hooks/use-end-room';
import { languageAtom, themeAtom } from '@/jotai/atoms';
import { Room } from '@/types/room';
import { Box } from '@mui/material';
import axios from 'axios';
import { useAtom } from 'jotai';
import { Ban, SquareArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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

const LanguageSelector = ({
  room,
  firstRender,
}: {
  room: Room;
  firstRender: React.RefObject<boolean>;
}) => {
  const [lang, setLang] = useAtom(languageAtom);
  const { userDetails } = useUser();

  useEffect(() => {
    if (!firstRender.current) return;

    firstRender.current = false;

    setLang({
      ...lang,
      currValue: room.lastLanguage || lang.defaultValue,
      currLabel:
        LANGUAGE_OPTIONS.find(item => item.value === room.lastLanguage)
          ?.label || lang.defaultLabel,
    });
  }, []);

  const handleLanguageChange = async (
    value: string,
    roomId: string,
    userId: string,
  ) => {
    if (userId !== room.ownerUuid) {
      toast.error('You are not the owner of this room');
      return;
    }

    // Update the language of the room in the database
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/v1/room/${roomId}`,
        {
          lastLanguage: value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'Allow-Control-Allow-Origin': '*',
          },
        },
      );

      if (response.status === 200) {
        toast.success('Language updated successfully');

        // Update global state only after successful API call
        const newLabel =
          LANGUAGE_OPTIONS.find(item => item.value === value)?.label ||
          lang.defaultLabel;
        setLang({
          ...lang,
          currValue: value,
          currLabel: newLabel,
        });
      } else {
        toast.error('Failed to update language');
      }
    } catch (error: any) {
      toast.error('Failed to update language');
      console.error(error);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Select Language:</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Select
            value={lang.currValue || lang.defaultValue}
            onValueChange={async value => {
              await handleLanguageChange(value, room.id, userDetails?.id || '');
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  LANGUAGE_OPTIONS.find(item => item.value === lang.currValue)
                    ?.label || lang.defaultLabel
                }
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
            value={theme.currValue || theme.defaultValue}
            onValueChange={value => {
              setTheme({
                ...theme,
                currValue: value,
                currLabel:
                  THEME_OPTIONS.find(item => item.value === value)?.label ||
                  theme.defaultLabel,
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={theme.currLabel || theme.defaultLabel}
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
  room,
}: {
  connectedUsers: {
    userName: string;
    avatarUrl: string;
    userId: string;
  }[];
  roomId: string;
  socketRef: React.RefObject<Socket | null>;
  room: Room;
}) => {
  const { userDetails } = useUser();
  const navigate = useNavigate();

  const firstRender = useRef(true);
  const { mutate: endRoom } = useEndRoom();

  const handleLeaveRoom = async (leaveAll: boolean) => {
    if (!leaveAll) {
      socketRef.current?.emit(ACTIONS.LEAVE, {
        id: roomId,
        userName:
          userDetails?.name || userDetails?.githubUsername || 'Unknown User',
        userId: userDetails?.id,
      });

      endRoom({ id: roomId });
    } else
      socketRef.current?.emit(ACTIONS.END_ROOM, {
        id: roomId,
        userName:
          userDetails?.name || userDetails?.githubUsername || 'Unknown User',
        userId: userDetails?.id,
      });
    toast.success('You have left the room');
    navigate(ROUTES.HOME);
  };

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col gap-4 p-4 items-center overflow-x-hidden">
        <LogoComponent />

        <SidebarSeparator />

        <CurrentlyConnectedUsers connectedUsers={connectedUsers} />

        <SidebarSeparator />

        {room && room.ownerUuid === userDetails?.id && (
          <LanguageSelector room={room} firstRender={firstRender} />
        )}
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

        {room && room.ownerUuid === userDetails?.id ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="destructive"
                className="border-none p-2.5 rounded-2xl text-md font-bold cursor-pointer transition-all ease-in-out duration-300 bg-red-400 text-black hover:scale-105"
              >
                Leave Room
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async e => {
                    e.preventDefault();
                    await handleLeaveRoom(false);
                  }}
                >
                  <SquareArrowLeft />
                  <span>Just Leave</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async e => {
                    e.preventDefault();
                    await handleLeaveRoom(true);
                  }}
                >
                  <Ban />
                  <span>
                    End Room for{' '}
                    <span className="font-bold underline">ALL</span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="border-none p-2.5 rounded-2xl text-md font-bold cursor-pointer transition-all ease-in-out duration-300 bg-red-400 text-black hover:text-white"
            onClick={async e => {
              e.preventDefault();
              await handleLeaveRoom(false);
            }}
          >
            Leave Room
          </Button>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default EditorSidebar;

import { ACTIONS } from '@/constants/actions';
import { ROUTES } from '@/constants/routes';
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from '@/constants/sidebar-options';
import { TYPING_DEBOUNCE } from '@/constants/utils';
import { useUser } from '@/context/user-context';
import { useHandleLanguageChange } from '@/hooks/database-query/use-handle-language-change';
import { languageAtom, themeAtom } from '@/jotai/atoms';
import { User } from '@/types/member-profile/user';
import { Room } from '@/types/room';
import { disconnectSocket } from '@/utils/socket';
import { Box } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
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
import { Separator } from './ui/separator';
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

const getListOfConnectedUsers = (
  connectedUsers: {
    userName: string;
    avatarUrl: string;
    userId: string;
  }[],
  roomOwner: string,
): {
  userName: string;
  avatarUrl: string;
  userId: string;
  isOwner: number;
}[] => {
  // if room owner is in the list of connected users, make him first in the list
  const listOfConnectedUsers = connectedUsers.map(user => ({
    ...user,
    isOwner: +(user.userId === roomOwner),
  }));

  // sort the list of connected users by isOwner
  listOfConnectedUsers.sort((a, b) => b.isOwner - a.isOwner);

  return listOfConnectedUsers;
};

const CurrentlyConnectedUsers = ({
  connectedUsers,
  roomOwner,
}: {
  connectedUsers: {
    userName: string;
    avatarUrl: string;
    userId: string;
  }[];
  roomOwner: string;
}) => {
  const currentConnectedUsers = getListOfConnectedUsers(
    connectedUsers,
    roomOwner,
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Connected</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {currentConnectedUsers.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <Box>
                  <Avatar>
                    <AvatarImage src={item.avatarUrl} />
                    <AvatarFallback>{item.userName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>
                    {item.userName}
                    {item.isOwner ? ' (Owner)' : ''}
                  </span>
                </Box>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {currentConnectedUsers.length > 5 && (
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
};

const LanguageSelector = ({
  room,
  firstRender,
  socketRef,
  owner,
}: {
  room: Room;
  firstRender: React.RefObject<boolean>;
  socketRef: React.RefObject<Socket | null>;
  owner: boolean;
}) => {
  const [lang, setLang] = useAtom(languageAtom);
  const { userDetails } = useUser();
  const { mutate: handleLanguageChangeMutation } = useHandleLanguageChange();

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

    return () => {
      socketRef.current?.removeListener(ACTIONS.LANGUAGE_CHANGE_HANDLE);
    };
  }, [lang]);

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
      handleLanguageChangeMutation(
        {
          roomId,
          lastLanguage: value,
        },
        {
          onSuccess: () => {
            toast.success('Language updated successfully');

            const newLabel =
              LANGUAGE_OPTIONS.find(item => item.value === value)?.label ||
              lang.defaultLabel;
            setLang({
              ...lang,
              currValue: value,
              currLabel: newLabel,
            });
          },
          onError: (error: Error) => {
            toast.error('Failed to update language', {
              description: error.message,
            });
          },
        },
      );
    } catch (error: any) {
      toast.error('Failed to update language');
      console.error(error);
    }

    socketRef.current?.emit(ACTIONS.LANGUAGE_CHANGE, {
      id: roomId,
      language: value,
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {owner ? 'Select Language:' : 'Current Language:'}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Select
            value={lang.currValue || lang.defaultValue}
            onValueChange={async value => {
              if (owner)
                await handleLanguageChange(
                  value,
                  room.id,
                  userDetails?.id || '',
                );
            }}
          >
            <SelectTrigger className="w-[180px]" disabled={!owner}>
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

const LeaveButton = ({
  socketRef,
  roomId,
  userDetails,
  message,
  endAll,
}: {
  socketRef: React.RefObject<Socket | null>;
  roomId: string;
  userDetails: User | undefined;
  message?: string;
  endAll?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <Button
      className="border-none p-2.5 rounded-2xl text-md font-bold cursor-pointer transition-all ease-in-out duration-300 bg-red-400 text-black hover:text-white"
      onClick={async e => {
        if (endAll === undefined) return;

        e.preventDefault();
        if (endAll) {
          socketRef.current?.emit(ACTIONS.END_ROOM, {
            id: roomId,
            userName:
              userDetails?.name ||
              userDetails?.githubUsername ||
              'Unknown User',
            userId: userDetails?.id,
          });
          toast.success('You have ended the room');

          disconnectSocket();
        } else {
          socketRef.current?.emit(ACTIONS.LEAVE, {
            id: roomId,
            userName:
              userDetails?.name ||
              userDetails?.githubUsername ||
              'Unknown User',
            userId: userDetails?.id,
          });
          toast.success('You have left the room');
        }

        navigate(ROUTES.HOME);
      }}
    >
      {message || 'Leave Room'}
    </Button>
  );
};

const PopoverLeaveButton = ({
  socketRef,
  roomId,
  userDetails,
}: {
  socketRef: React.RefObject<Socket | null>;
  roomId: string;
  userDetails: User | undefined;
}) => (
  <div className="flex flex-col gap-2 border-4 border-black py-5 px-2 rounded-lg pointer-events-auto">
    <LeaveButton
      socketRef={socketRef}
      userDetails={userDetails}
      roomId={`${roomId}`}
      endAll={true}
      message="End Room for all"
    />

    <Separator className="w-5 bg-black" />

    <LeaveButton
      socketRef={socketRef}
      userDetails={userDetails}
      roomId={`${roomId}`}
      endAll={false}
      message="Leave Room"
    />
  </div>
);

export const EditorSidebar = ({
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

  const firstRender = useRef(true);

  useEffect(() => {
    const init = async () => {
      socketRef.current?.on(
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

        <CurrentlyConnectedUsers
          connectedUsers={connectedUsers}
          roomOwner={room.ownerUuid}
        />

        <SidebarSeparator />

        <LanguageSelector
          room={room}
          firstRender={firstRender}
          socketRef={socketRef}
          owner={room && room.ownerUuid === userDetails?.id}
        />

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
          <Popover>
            <PopoverTrigger className="border-none p-2.5 rounded-2xl text-md font-bold cursor-pointer transition-all ease-in-out duration-300 bg-red-400 text-black hover:text-white">
              Leave Room
            </PopoverTrigger>
            <PopoverContent>
              <PopoverLeaveButton
                socketRef={socketRef}
                userDetails={userDetails}
                roomId={`${roomId}`}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <LeaveButton
            socketRef={socketRef}
            userDetails={userDetails}
            roomId={`${roomId}`}
            endAll={false}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
};

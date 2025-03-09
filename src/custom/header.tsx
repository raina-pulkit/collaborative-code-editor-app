import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import { Box, Typography } from '@mui/material';
import { AvatarImage } from '@radix-ui/react-avatar';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = ({ imgSource }: { imgSource?: string }): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: '0 0 10px 10px',
        padding: '1rem',
        marginLeft: '1rem',
        marginRight: '1rem',
      }}
    >
      <Typography variant="h6" component="div">
        Collaborative Code Editor
      </Typography>
      <Box>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarImage src={imgSource} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)}>
                <User />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  navigate(ROUTES.LOGIN);
                }}
              >
                <LogOut />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Typography variant="body1" component="span">
          About
        </Typography>
      </Box>
    </Box>
  );
};

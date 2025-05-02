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
import { FaCodeBranch } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export const Header = ({ imgSource }: { imgSource?: string }): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundImage:
          'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
        color: 'white',
        borderRadius: '0 0 10px 10px',
        padding: '0.75rem 1rem',
        height: '60px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <FaCodeBranch
          style={{
            color: 'black',
            fontSize: '1.8rem',
            backgroundColor: 'transparent',
          }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: 'black',
          }}
        >
          CodeFusion
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          gap: '0.25rem',
          marginLeft: 'auto',
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer select-none">
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src={imgSource} className="object-cover" />
              <AvatarFallback className="text-xs">CN</AvatarFallback>
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
      </Box>
    </Box>
  );
};

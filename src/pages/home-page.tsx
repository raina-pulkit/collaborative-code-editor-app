import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CREATE_ROOM } from '@/constants/button-texts';
import { ROUTES } from '@/constants/routes';
import { useUser } from '@/context/user-context';
import { Header } from '@/custom/header';
import { Room } from '@/types/room';
import { Box, Container, Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validate } from 'uuid';
import { LoadingPage } from './loading-page';

const HomePage = (): JSX.Element => {
  const { userDetails, isLoading, error } = useUser();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>('');
  const [isPrivate, _setIsPrivate] = useState<boolean>(false);
  const [invitedUsers, _setInvitedUsers] = useState<string[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    try {
      const response: AxiosResponse<Room> = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/room`,
        {
          ownerUuid: userDetails?.id,
          isPrivate,
          invitedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate(ROUTES.LOGIN);
        return;
      }

      if (response.status === 201) {
        navigate(`${ROUTES.EDITOR}/${response.data.id}`);
        return;
      } else {
        toast.error('Failed to create room', {
          description: response.statusText,
        });
        return;
      }
    } catch (error: any) {
      toast.error('Failed to create room', {
        description: error.message,
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  useEffect(() => {
    if (error) {
      localStorage.removeItem('accessToken');
      navigate(ROUTES.LOGIN);
    }
  }, [error, navigate]);

  if (isLoading) return <LoadingPage message="Fetching user details" />;

  return (
    <Container className="bg-accent-foreground min-w-full min-h-screen !p-0 relative">
      <Box sx={{ position: 'sticky', top: 0 }}>
        <Header imgSource={userDetails?.avatarUrl} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 98px)',
          textAlign: 'center',
          padding: '2rem',
          color: 'white',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Collaborative Code Editor
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          A real-time collaborative platform for coding together
        </Typography>
        <Typography variant="body1" color="bisque">
          Start coding with your team in real-time. Create or join a session to
          begin collaborating.
        </Typography>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (validate(roomId)) navigate(`${ROUTES.EDITOR}/${roomId}`);
            else
              toast.error('Invalid room id', {
                description: 'Please enter a valid room id',
                descriptionClassName: 'text-white',
                style: {
                  backgroundColor: 'red',
                  color: 'white',
                },
              });
          }}
          className="flex gap-2 mt-10"
        >
          <Input
            placeholder="Enter room id"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
          />
          <Button type="submit">Join Room</Button>
        </form>
        <Button
          variant="outline"
          onClick={handleCreateRoom}
          disabled={isCreatingRoom}
        >
          {CREATE_ROOM}
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;

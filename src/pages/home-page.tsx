import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CREATE_ROOM } from '@/constants/button-texts';
import { ROUTES } from '@/constants/routes';
import { useUser } from '@/context/user-context';
import { Header } from '@/custom/header';
import { Box, Container, Typography } from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v7 as uuid, validate } from 'uuid';
import { LoadingPage } from './loading-page';

const HomePage = (): JSX.Element => {
  const { userDetails, isLoading, error } = useUser();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>('');

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
          gap: '2rem',
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
        <div className="flex gap-4 min-w-2xl">
          <Button
            variant="outline"
            onClick={() => {
              const roomId = uuid();
              navigate(`${ROUTES.EDITOR}/${roomId}`);
            }}
            className="text-black hover:bg-accent-foreground hover:text-white active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {CREATE_ROOM}
          </Button>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (validate(roomId)) navigate(`${ROUTES.EDITOR}/${roomId}`);
              else
                toast.error('Invalid room id', {
                  style: {
                    backgroundColor: 'red',
                    color: 'white',
                  },
                });
            }}
            className="flex w-full gap-2"
          >
            <Input
              placeholder="Enter room id"
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
            />
            <Button
              type="submit"
              className="cursor-pointer hover:bg-white hover:text-black active:scale-95 transition-all duration-300"
            >
              Join Room
            </Button>
          </form>
        </div>
      </Box>
    </Container>
  );
};

export default HomePage;

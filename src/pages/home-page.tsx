import { ROUTES } from '@/constants/routes';
import { useUser } from '@/context/user-context';
import { Header } from '@/custom/header';
import { Box, Container, Typography } from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './loading-page';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { v7 as uuid, validate } from 'uuid';
import { toast } from 'sonner';
import { CREATE_ROOM } from '@/constants/button-texts';

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
          onClick={() => {
            const roomId = uuid();
            navigate(`${ROUTES.EDITOR}/${roomId}`);
          }}
        >
          {CREATE_ROOM}
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;

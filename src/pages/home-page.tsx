import { ROUTES } from '@/constants/routes';
import { useError } from '@/context/error-context';
import { useUser } from '@/context/user-context';
import { Header } from '@/custom/header';
import { Box, Container, Typography } from '@mui/material';
import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './loading-page';

const HomePage = (): JSX.Element => {
  const { userDetails, isLoading, error } = useUser();
  const { errorMessage, setErrorMessage } = useError();
  const navigate = useNavigate();

  console.log('pulkit user details: ', userDetails);
  console.log('pulkit error: ', error);
  console.log('pulkit error message: ', errorMessage);
  console.log('pulkit is loading: ', isLoading);

  if (error || errorMessage) {
    setErrorMessage(error?.message || errorMessage || 'Error fetching user details');
    setTimeout(() => {
      localStorage.removeItem('accessToken');
      navigate(ROUTES.LOGIN);
    }, 3000);
    navigate(ROUTES.ERROR);
    return <></>;
  } else if (isLoading) return <LoadingPage />;

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
      </Box>
    </Container>
  );
};

export default HomePage;

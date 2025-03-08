import { ROUTES } from '@/constants/routes';
import { useError } from '@/context/error-context';
import { Header } from '@/custom/header';
import { useGetUserDetails } from '@/utils/use-get-user-details';
import { Box, Container, Typography } from '@mui/material';
import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './loading-page';

const HomePage = (): JSX.Element => {
  const { data: userDetails, status, isFetching, error } = useGetUserDetails();

  const { setErrorMessage } = useError();

  const navigate = useNavigate();

  if (error || localStorage.getItem('accessToken') === '') {
    setErrorMessage(error?.message || 'Error fetching user details');
    setTimeout(() => {
      localStorage.removeItem('accessToken');
      navigate(ROUTES.LOGIN);
    }, 3000);
    navigate(ROUTES.ERROR);
    return <></>;
  } else if (status === 'pending' || isFetching) return <LoadingPage />;

  return (
    <Container className="bg-accent-foreground min-w-screen">
      <Header imgSource={userDetails.avatarUrl} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
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

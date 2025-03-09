import { Box, Container, Typography } from '@mui/material';
import { JSX, useEffect } from 'react';
import { useError } from '../context/error-context';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';

const ErrorPage = (): JSX.Element => {
  const { errorMessage: contextErrorMessage, setErrorMessage } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    if (!contextErrorMessage || contextErrorMessage === '') {
      navigate(ROUTES.HOME);
      return;
    }
    if (contextErrorMessage === 'Unauthorized') {
      localStorage.removeItem('accessToken');
      setErrorMessage('');
      navigate(ROUTES.LOGIN);
    }
  }, [contextErrorMessage, navigate, setErrorMessage]);

  const handleGoHome = () => {
    setErrorMessage('');
    navigate(ROUTES.HOME);
  };

  return (
    <Container sx={{ m: 0, p: 0, bgcolor: 'red' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'red',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          ERROR OCCURRED
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {contextErrorMessage}
        </Typography>
        <Button
          className="cursor-pointer hover:scale-110 active:scale-125"
          onClick={handleGoHome}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;

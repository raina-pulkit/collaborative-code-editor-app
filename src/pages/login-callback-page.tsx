import { ROUTES } from '@/constants/routes';
import { useError } from '@/context/error-context';
import { useGetAccessToken } from '@/utils/use-get-access-token';
import { Box, Container } from '@mui/material';
import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './loading-page';

const AuthRedirectPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { status, data, error, isFetching } = useGetAccessToken();
  const { setErrorMessage } = useError();

  useEffect(() => {
    const handleAuth = () => {
      try {
        if (error) {
          setErrorMessage(error.message);
          navigate(ROUTES.LOGIN);
        } else if (status === 'success' && !isFetching && data) {
          setErrorMessage('');
          localStorage.setItem('accessToken', data);
          navigate(ROUTES.HOME);
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'An error occurred';
        setErrorMessage(errorMsg);
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      }
    };

    handleAuth();
  }, [status, data, error, isFetching, navigate, setErrorMessage]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <LoadingPage 
          size={100} 
          message={status === 'pending' || isFetching ? "Authorizing your access..." : "Redirecting..."} 
        />
      </Box>
    </Container>
  );
};

export default AuthRedirectPage;

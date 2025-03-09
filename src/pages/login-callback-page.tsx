import { ROUTES } from '@/constants/routes';
import { useError } from '@/context/error-context';
import { fetchUserDetailsErrorMessageAtom } from '@/jotai/atoms';
import { useGetAccessToken } from '@/utils/use-get-access-token';
import { Box, Container, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './loading-page';

const AuthRedirectPage = (): JSX.Element => {
  const [, setFetchUserDetailsErrorMessage] = useAtom(
    fetchUserDetailsErrorMessageAtom,
  );
  const navigate = useNavigate();

  const { status, data, error, isFetching } = useGetAccessToken();

  const { setErrorMessage } = useError();

  try {
    if (error) {
      setErrorMessage(error.message);
    } else if (status == 'pending' || isFetching) {
      /* empty */
    } else if (status === 'success' && !isFetching) {
      setFetchUserDetailsErrorMessage('');
      localStorage.setItem('accessToken', data);
      navigate(ROUTES.HOME);
    } else throw new Error('Unknown error occured!');
  } catch (e: unknown) {
    setFetchUserDetailsErrorMessage(
      e instanceof Error ? e.message : 'An error occurred',
    );
    console.log(
      'error is: ',
      e instanceof Error ? e.message : 'An error occurred',
    );
    setTimeout(() => {
      navigate(ROUTES.LOGIN);
    }, 3000);
  }

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
        <Typography variant="h4" component="h1">
          Redirecting to home page... please wait...
        </Typography>
        <LoadingPage size={100} />
      </Box>
    </Container>
  );
};

export default AuthRedirectPage;

import { Box, Container, Typography } from '@mui/material';
import { JSX } from 'react';
import { useError } from '../context/error-context';

const ErrorPage = (): JSX.Element => {
  const { errorMessage: contextErrorMessage } = useError();

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
          ERROR OCCURED
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {contextErrorMessage}
        </Typography>
      </Box>
    </Container>
  );
};

export default ErrorPage;

import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { JSX } from 'react';

export const LoadingPage = ({
  size,
  message,
}: {
  size?: number;
  message?: string;
}): JSX.Element => (
  <Container>
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
      <Typography variant="h6" component="div">
        {message || 'Loading...'}
      </Typography>
      <CircularProgress size={size || 20} />
    </Box>
  </Container>
);

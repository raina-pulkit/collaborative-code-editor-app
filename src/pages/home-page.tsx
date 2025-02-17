import { JSX } from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage = (): JSX.Element => {
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
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Collaborative Code Editor
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          A real-time collaborative platform for coding together
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start coding with your team in real-time. Create or join a session to begin collaborating.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
import { InterviewComp } from '@/components/interview';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useUser } from '@/context/user-context';
import { Header } from '@/custom/header';
import { Box, Container, Typography } from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './loading-page';
// import { DrawingCanvas } from './demo';

const HomePage = (): JSX.Element => {
  const { userDetails, isLoading, error } = useUser();
  const navigate = useNavigate();
  const [page, setPage] = useState('home');

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
        {page === 'home' && (
          <>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Collaborative Code Editor
            </Typography>
            <Card className="w-80 shadow-lg rounded-2xl">
              <CardHeader className="text-xl font-bold">
                Choose the purpose of collaborating
              </CardHeader>
              <CardFooter className="flex flex-col gap-5">
                <Button
                  variant="default"
                  className="w-60"
                  onClick={() => setPage('development')}
                >
                  Development
                </Button>
                <Button
                  variant="default"
                  className="w-60"
                  onClick={() => setPage('interview')}
                >
                  Interview
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
        {page === 'development' && (
          <Typography variant="h4">Development Mode Coming Soon!</Typography>
        )}

        {page === 'interview' && <InterviewComp />}
      </Box>
    </Container>
  );
};

export default HomePage;

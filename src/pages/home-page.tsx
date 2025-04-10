import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useUser } from '@/context/user-context';
import { Header } from '@/custom/header';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from './loading-page';
// import { DrawingCanvas } from './demo';

const HomePage = (): JSX.Element => {
  const quotes = [
    'Seamless collaborative coding.',
    'Your AI-powered coding companion.',
    'Code together, anytime.',
    'Real-time coding, real-time innovation.',
    'Where collaboration meets code.',
    'Work together, build better.',
    'Merging ideas, building solutions.',
    'Code, collaborate, conquer.',
    'Bridging minds through code.',
    'Connect, collaborate, create.',
  ];

  const { userDetails, isLoading, error } = useUser();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)],
  );

  useEffect(() => {
    if (error) {
      localStorage.removeItem('accessToken');
      navigate(ROUTES.LOGIN);
    }
  }, [error, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
          // color: 'white',
          gap: '2rem',
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            textAlign: 'center',
            mb: 4,
            transition: 'all 0.3s ease',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#94a3b8',
              maxWidth: 700,
              fontSize: { xs: '1.2rem', sm: '1.8rem' },
              lineHeight: 1.5,
            }}
          >
            “{quote}”
          </Typography>
        </Box>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="w-full h-full max-w-md bg-[#393f4c] text-white shadow-xl rounded-2xl border border-gray-700 p-6">
            <CardHeader className="text-2xl font-semibold text-center mb-4">
              Choose how you want to collaborate
            </CardHeader>

            <CardFooter className="flex flex-col gap-6 items-center">
              {/* Development Button */}
              <div className="flex flex-col items-center gap-2 w-full">
                <Button
                  onClick={() => navigate(ROUTES.DEVELOPER)}
                  className="w-60 rounded-xl px-6 py-3 text-lg font-semibold text-[black] transition transform hover:scale-105 cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
                  }}
                >
                  Development
                </Button>
                <p className="text-sm text-gray-400 text-center">
                  Choose this if you are building or testing code together.
                </p>
              </div>

              {/* Interview Button */}
              <div className="flex flex-col items-center gap-2 w-full">
                <Button
                  onClick={() => navigate(ROUTES.INTERVIEW)}
                  className="w-60 rounded-xl px-6 py-3 text-lg font-semibold text-[black] transition transform hover:scale-105 cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
                  }}
                >
                  Interview
                </Button>
                <p className="text-sm text-gray-400 text-center">
                  Choose this if you are conducting or attending technical
                  interviews.
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default HomePage;

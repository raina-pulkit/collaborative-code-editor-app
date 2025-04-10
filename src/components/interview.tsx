import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
export const InterviewComp = () => {
  // const { userDetails, isLoading, error } = useUser();

  const navigate = useNavigate();

  return (
    <Container className="bg-accent-foreground min-w-full min-h-screen !p-0 relative">
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="w-full h-full max-w-md bg-[#393f4c] text-white shadow-xl rounded-2xl border border-gray-700 p-6">
            <CardHeader className="text-2xl font-semibold text-center mb-4">
              Joining as?
            </CardHeader>
            <CardFooter className="flex flex-col gap-6 items-center">
              <div className="flex flex-col items-center gap-2 w-full">
                <Button
                  onClick={() => navigate(ROUTES.SELECTQUESTION)}
                  className="w-60 rounded-xl px-6 py-3 text-lg font-semibold text-[black] transition transform hover:scale-105 cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
                  }}
                >
                  Interviewer
                </Button>
              </div>
              <Button
                onClick={() => navigate(ROUTES.ROOMCODE)}
                className="w-60 rounded-xl px-6 py-3 text-lg font-semibold text-[black] transition transform hover:scale-105 cursor-pointer"
                style={{
                  background:
                    'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
                }}
              >
                Interviewee
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};
export default InterviewComp;

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Box, Container } from '@mui/material';
import { useState } from 'react';

export const InterviewComp = () => {
  // const { userDetails, isLoading, error } = useUser();
  const [page, setPageI] = useState('interview');

  return (
    <Container className="bg-accent-foreground min-w-full min-h-screen !p-0 relative">
      {/* <Box sx={{ position: 'sticky', top: 0 }}>
          <Header imgSource={userDetails?.avatarUrl} />
        </Box> */}
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
        {page === 'interview' && (
          <Card className="w-80 shadow-lg rounded-2xl">
            <CardHeader className="text-xl font-bold">Joining as?</CardHeader>
            <CardFooter className="flex flex-col gap-5">
              <Button
                variant="default"
                className="w-60"
                onClick={() => setPageI('interviewer')}
              >
                Interviewer
              </Button>
              <Button
                variant="default"
                className="w-60"
                onClick={() => setPageI('interviewee')}
              >
                Interviewee
              </Button>
            </CardFooter>
          </Card>
        )}
      </Box>
    </Container>
  );
};
export default InterviewComp;

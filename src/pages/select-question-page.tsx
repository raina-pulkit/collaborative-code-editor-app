// src/pages/interview-page.tsx
import { QuestionSelector } from '@/components/select_questions';
import { useUser } from '@/context/user-context';
import { Header } from '@/custom/header';
import { Box, Container } from '@mui/material';
import { JSX } from 'react';
import { LoadingPage } from './loading-page';

const SelectQuestionPage = (): JSX.Element => {
  const { userDetails, isLoading } = useUser();

  if (isLoading) return <LoadingPage message="Fetching user details" />;

  return (
    <Container className="bg-accent-foreground min-w-full min-h-screen !p-0 relative">
      <Box sx={{ position: 'sticky', top: 0 }}>
        <Header imgSource={userDetails?.avatarUrl} />
      </Box>
      <QuestionSelector />
    </Container>
  );
};

export default SelectQuestionPage;

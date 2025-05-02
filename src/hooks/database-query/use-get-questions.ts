import { Question } from '@/types/questions';
import { useQuery } from '@tanstack/react-query';

const fetchAllQuestions = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/questions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.statusText}`);
  }

  const { data }: { data: Question[] } = await response.json();

  return data;
};

export const useGetQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: fetchAllQuestions,
  });
};

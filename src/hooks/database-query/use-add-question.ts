import { Question, QuestionDto } from '@/types/questions';
import { useMutation } from '@tanstack/react-query';

const createNewQuestion = async ({
  title,
  description,
  difficulty,
}: QuestionDto): Promise<Question> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      mode: 'cors',
    },
    body: JSON.stringify({
      title,
      description,
      difficulty,
    }),
  });

  if (!response.ok) {
    const errorObj = await response.json();
    if (response.status === 400) {
      throw new Error(
        `${errorObj.statusCode}: Failed to create question - ${errorObj.message}`,
      );
    } else throw new Error('Failed to create question');
  }

  const { data }: { data: Question } = await response.json();
  return data;
};

export const useAddQuestion = () => {
  return useMutation({
    mutationFn: async (questionDto: QuestionDto) =>
      createNewQuestion(questionDto),
  });
};

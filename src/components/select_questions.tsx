import { CreateQuestionModal } from '@/components/create-question-modal';
import { InviteParticipants } from '@/components/invite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Question = {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export const QuestionSelector = () => {
  const [step, setStep] = useState<'questions' | 'invite'>('questions');
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  const fetchQuestions = async () => {
    // fetch('http://localhost:3030/questions')
    //   .then(res => res.json())
    //   .then(data => {
    //     setQuestions(data);
    //     setFilteredQuestions(data);
    //   })
    //   .catch(err => console.error('Error fetching questions:', err));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/questions`,
      );
      const data = response.data;
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions', {
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    setFilteredQuestions(
      questions.filter(q => q.title.toLowerCase().includes(lower)),
    );
  };

  const handleSelect = (question: Question) => {
    if (!selectedQuestions.find(q => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleSubmit = () => {
    setStep('invite');
  };

  if (step === 'invite') {
    return <InviteParticipants />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex gap-6 p-6 w-full h-[80vh]">
        <Card className="w-1/2 h-[650px] bg-[#393f4c] text-white shadow-xl rounded-2xl border border-gray-700 p-6 flex flex-col">
          <CardHeader className="text-2xl font-semibold text-center mb-4">
            Questions
          </CardHeader>
          <CardContent className="flex flex-col flex-grow overflow-hidden">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="w-full rounded-xl px-4 py-2 text-white"
              />
              <CreateQuestionModal onSuccess={fetchQuestions} />
            </div>

            <div className="space-y-2 overflow-y-auto flex-grow pr-1">
              {filteredQuestions.map(q => (
                <Button
                  key={q.id}
                  variant="secondary"
                  className="border border-gray-600 w-full justify-between items-center rounded-xl px-4 py-2 text-white bg-[#4b5563] hover:bg-[#6b7280] hover:scale-105 transition"
                  onClick={() => handleSelect(q)}
                >
                  <span className="text-left">{q.title}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      q.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : q.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/2 h-[650px] bg-[#393f4c] text-white shadow-xl rounded-2xl border border-gray-700 p-6 flex flex-col">
          <CardHeader className="text-2xl font-semibold text-center mb-4">
            Selected Questions
          </CardHeader>
          <CardContent className="flex flex-col flex-grow justify-between">
            <div className="space-y-2 overflow-y-auto">
              {selectedQuestions.map(q => (
                <div
                  key={q.id}
                  className="border border-gray-600 rounded-xl px-4 py-2 flex justify-between items-center bg-[#4b5563]"
                >
                  <span>{q.title}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      q.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : q.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
              ))}
            </div>
            <Button
              className="mt-4 w-60 mx-auto rounded-xl px-6 py-3 text-lg font-semibold text-black transition transform hover:scale-105 cursor-pointer"
              style={{
                background:
                  'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionSelector;

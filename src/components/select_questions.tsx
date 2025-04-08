import { CreateQuestionModal } from '@/components/create-question-modal';
import InviteParticipants from '@/components/invite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

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

  const fetchQuestions = () => {
    fetch('http://localhost:3030/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setFilteredQuestions(data);
      })
      .catch(err => console.error('Error fetching questions:', err));
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
    <div className="flex gap-4 p-4">
      <Card className="w-1/2 h-[500px] flex flex-col">
        <CardHeader className="font-bold text-lg">Questions</CardHeader>
        <CardContent className="flex flex-col flex-grow overflow-hidden">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full"
            />
            <CreateQuestionModal onSuccess={fetchQuestions} />
          </div>

          <div className="space-y-2 overflow-y-auto flex-grow pr-1">
            {filteredQuestions.map(q => (
              <Button
                key={q.id}
                variant="secondary"
                className="w-full justify-between items-center"
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

      <Card className="w-1/2 h-[500px] flex flex-col justify-between">
        <CardHeader className="font-bold text-lg">
          Selected Questions
        </CardHeader>
        <CardContent className="flex flex-col flex-grow justify-between">
          <div className="space-y-2 overflow-y-auto">
            {selectedQuestions.map(q => (
              <div
                key={q.id}
                className="border rounded p-2 flex justify-between items-center"
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
          <Button className="mt-4 w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionSelector;

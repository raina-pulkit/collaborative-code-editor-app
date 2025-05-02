import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddQuestion } from '@/hooks/database-query/use-add-question';
import { DifficultyEnum } from '@/types/questions';
import React, { useState } from 'react';
import { toast } from 'sonner';

type CreateQuestionProps = {
  onSuccess: () => void;
};

export const CreateQuestionModal: React.FC<CreateQuestionProps> = ({
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyEnum>(
    DifficultyEnum.EASY,
  );
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { isPending, mutate: addQuestion } = useAddQuestion();

  const handleSubmit = async () => {
    try {
      addQuestion(
        { title, description, difficulty },
        {
          onSuccess: () => {
            toast.success('Question created successfully!');
            onSuccess();
            setTitle('');
            setDescription('');
            setDifficulty(DifficultyEnum.EASY);
            setDialogOpen(false);
          },
          onError: error => {
            toast.error('Error creating question', {
              description: error?.message,
              duration: 3000,
            });
          },
        },
      );
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild disabled={isPending}>
        <Button
          variant="outline"
          className="w-40 rounded-xl px-6 py-2 text-[black] text-lg transition transform hover:scale-105"
          style={{
            background: 'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
          }}
        >
          Create Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Difficulty</Label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as DifficultyEnum)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full flex justify-center">
            <Button
              onClick={handleSubmit}
              className="w-60 rounded-xl px-6 py-2 text-[black] font-semibold text-lg transition transform hover:scale-105"
              style={{
                background:
                  'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
              }}
            >
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

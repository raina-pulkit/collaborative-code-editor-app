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
import React, { useState } from 'react';

type CreateQuestionProps = {
  onSuccess: () => void;
};

export const CreateQuestionModal: React.FC<CreateQuestionProps> = ({
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'easy',
  );

  const handleSubmit = async () => {
    try {
      console.log(
        JSON.stringify({
          title,
          description,
          difficulty,
        }),
      );

      const response = await fetch(`${process.env.VITE_API_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          isCustom: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Error: ${errorData.message}`);
        return;
      }

      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button >Create Question</Button> */}
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
              onChange={e =>
                setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
              }
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

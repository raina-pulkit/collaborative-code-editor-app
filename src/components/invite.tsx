'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function InviteParticipants() {
  const [interviewees, setInterviewees] = useState<string[]>([]);
  const [interviewers, setInterviewers] = useState<string[]>([]);
  const [inputInterviewee, setInputInterviewee] = useState('');
  const [inputInterviewer, setInputInterviewer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddEmail = (
    type: 'interviewer' | 'interviewee',
    email: string,
  ) => {
    if (!email.trim()) return;
    const emailList = type === 'interviewer' ? interviewers : interviewees;
    if (emailList.includes(email.trim())) return;

    if (type === 'interviewer') {
      setInterviewers([...interviewers, email.trim()]);
      setInputInterviewer('');
    } else {
      setInterviewees([...interviewees, email.trim()]);
      setInputInterviewee('');
    }
  };

  const removeEmail = (type: 'interviewer' | 'interviewee', email: string) => {
    if (type === 'interviewer') {
      setInterviewers(interviewers.filter(e => e !== email));
    } else {
      setInterviewees(interviewees.filter(e => e !== email));
    }
  };

  const handleInvite = async () => {
    if (interviewees.length === 0) {
      toast.error('Please add at least one interviewee and interviewer.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-invite`,
        {
          interviewees,
          interviewers,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Sending payload:', { interviewees, interviewers });
      console.log('Response:', res.data);

      if (res.status === 200) {
        toast.success('Invitations sent successfully!');
        setInterviewees([]);
        setInterviewers([]);
      } else {
        toast.error('Failed to send invites.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-16">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Invite members to join room
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Interviewers */}
            <div className="bg-muted p-4 rounded-lg">
              <Label className="text-lg font-semibold">Interviewers</Label>
              <Input
                className="mt-2"
                placeholder="Type email and press Enter"
                value={inputInterviewer}
                onChange={e => setInputInterviewer(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEmail('interviewer', inputInterviewer);
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {interviewers.map(email => (
                  <span
                    key={email}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                  >
                    {email}
                    <button
                      onClick={() => removeEmail('interviewer', email)}
                      className="ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Interviewees */}
            <div className="bg-muted p-4 rounded-lg">
              <Label className="text-lg font-semibold">Interviewees</Label>
              <Input
                className="mt-2"
                placeholder="Type email and press Enter"
                value={inputInterviewee}
                onChange={e => setInputInterviewee(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEmail('interviewee', inputInterviewee);
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {interviewees.map(email => (
                  <span
                    key={email}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                  >
                    {email}
                    <button
                      onClick={() => removeEmail('interviewee', email)}
                      className="ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={handleInvite} disabled={loading}>
              {loading ? 'Sending...' : 'Invite'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

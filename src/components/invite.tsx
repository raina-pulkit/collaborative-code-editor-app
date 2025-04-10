'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';
import { DEFAULT_LANGUAGE } from '@/constants/sidebar-options';
import { useUser } from '@/context/user-context';
import { Room } from '@/types/room';
import axios, { AxiosResponse } from 'axios';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const InviteParticipants = () => {
  const [interviewees, setInterviewees] = useState<string[]>([]);
  const [interviewers, setInterviewers] = useState<string[]>([]);
  const [inputInterviewee, setInputInterviewee] = useState('');
  const [inputInterviewer, setInputInterviewer] = useState('');
  const navigate = useNavigate();
  const [isPrivate, _setIsPrivate] = useState<boolean>(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const { userDetails } = useUser();
  const [invitedUsers, _setInvitedUsers] = useState<string[]>([]);

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

  // const handleInvite = async () => {
  //   if (interviewees.length === 0) {
  //     toast.error('Please add at least one interviewee and interviewer.');
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/send-invite`,
  //       {
  //         interviewees,
  //         interviewers,
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     console.log('Sending payload:', { interviewees, interviewers });
  //     console.log('Response:', res.data);

  //     if (res.status === 200) {
  //       toast.success('Invitations sent successfully!');
  //       setInterviewees([]);
  //       setInterviewers([]);
  //     } else {
  //       toast.error('Failed to send invites.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error('Something went wrong. Try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateRoomAndInvite = async () => {
    if (interviewees.length === 0) {
      toast.error('Please add at least one interviewee.');
      return;
    }

    setLoading(true);
    setIsCreatingRoom(true);

    try {
      //  Create Room
      console.log('Creating Room with Payload:', {
        ownerUuid: userDetails?.id,
        isPrivate,
        invitedUsers: invitedUsers,
        lastLanguage: DEFAULT_LANGUAGE.value,
      });

      const roomResponse: AxiosResponse<Room> = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/room`,
        {
          ownerUuid: userDetails?.id,
          isPrivate,
          invitedUsers,
          lastLanguage: DEFAULT_LANGUAGE.value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );

      if (roomResponse.status === 401) {
        localStorage.removeItem('accessToken');
        navigate(ROUTES.LOGIN);
        return;
      }

      if (roomResponse.status === 201) {
        // navigate(`${ROUTES.EDITOR}/${roomResponse.data.id}`);
        console.log('Room created successfully!');
      } else {
        toast.error('Failed to create room', {
          description: roomResponse.statusText,
        });
        return;
      }
      console.log('Room response:', roomResponse);

      const roomId = roomResponse.data.id;

      // Send Invites
      const inviteResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-invite`,
        {
          interviewees,
          interviewers,
          roomId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (inviteResponse.status === 201) {
        toast.success('Room created and invitations sent!');
        setInterviewees([]);
        setInterviewers([]);
        navigate(`${ROUTES.EDITOR}/${roomId}`);
      } else {
        toast.error('Room created but failed to send invites.');
      }
      console.log('Invite Response:', inviteResponse);
    } catch (error: any) {
      console.error(error);
      toast.error('Something went wrong.', {
        description: error.message,
      });
    } finally {
      setLoading(false);
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl h-[500px] bg-[#393f4c] text-white shadow-xl rounded-2xl border border-gray-700 p-6">
        <CardContent className="h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-8">
              Invite members to join room
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Interviewers */}
              <div className="bg-[#2f3542] p-4 rounded-xl h-72 flex flex-col">
                <Label className="text-lg font-semibold mb-2 block">
                  Interviewers
                </Label>
                <Input
                  className="mt-2 bg-[#1e272e] border-gray-600 text-white"
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
                      className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
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
              <div className="bg-[#2f3542] p-4 rounded-xl h-72 flex flex-col">
                <Label className="text-lg font-semibold mb-2 block">
                  Interviewees
                </Label>
                <Input
                  className="mt-2 bg-[#1e272e] border-gray-600 text-white"
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
                      className="bg-green-200 text-green-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
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
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleCreateRoomAndInvite}
              disabled={isCreatingRoom}
              className="w-60 rounded-xl px-6 py-3 text-lg font-semibold text-[black] transition transform hover:scale-105 cursor-pointer"
              style={{
                background:
                  'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
              }}
            >
              {isCreatingRoom ? 'Creating...' : 'Invite & Create Room'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteParticipants;

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

export const InviteDevelopers = () => {
  const [developers, setDevelopers] = useState<string[]>([]);
  const [inputDeveloper, setInputDeveloper] = useState('');
  const [isPrivate, _setIsPrivate] = useState<boolean>(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const { userDetails } = useUser();
  const navigate = useNavigate();
  const [invitedUsers, _setInvitedUsers] = useState<string[]>([]);
  const [, setLoading] = useState(false);

  const handleAddDeveloper = (email: string) => {
    if (!email.trim() || developers.includes(email.trim())) return;
    setDevelopers(prev => [...prev, email.trim()]);
    setInputDeveloper('');
  };

  const removeDeveloper = (email: string) => {
    setDevelopers(prev => prev.filter(e => e !== email));
  };

  const handleCreateRoomAndInvite = async () => {
    if (developers.length === 0) {
      toast.error('Please invite at least one developer.');
      return;
    }

    setLoading(true);
    setIsCreatingRoom(true);

    console.log('Creating Room with Payload:', {
      ownerUuid: userDetails?.id,
      isPrivate,
      invitedUsers: developers,
      lastLanguage: DEFAULT_LANGUAGE.value,
    });

    try {
      // Create Room
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
      console.log('Room response:', roomResponse);

      if (roomResponse.status === 401) {
        localStorage.removeItem('accessToken');
        navigate(ROUTES.LOGIN);
        return;
      }

      if (roomResponse.status !== 201) {
        toast.error('Failed to create room', {
          description: roomResponse.statusText,
        });
        return;
      }

      const roomId = roomResponse.data.id;

      // Send Invites
      const inviteResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-invite`,
        {
          interviewees: developers,
          interviewers: [],
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
        setDevelopers([]);
        navigate(`${ROUTES.EDITOR}/${roomId}`);
      } else {
        toast.error('Room created but failed to send invites.');
      }
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
      <Card className="w-full max-w-xl h-[480px] bg-[#393f4c] text-white shadow-xl rounded-2xl border border-gray-700 p-6">
        <CardContent className="h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-8">
              Invite Developers to Collaborate
            </h2>

            <div className="bg-[#2f3542] p-4 rounded-xl h-64 flex flex-col">
              <Label className="text-lg font-semibold mb-2 block">
                Developer Emails
              </Label>
              <Input
                className="mt-2 bg-[#1e272e] border-gray-600 text-white"
                placeholder="Type email and press Enter"
                value={inputDeveloper}
                onChange={e => setInputDeveloper(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDeveloper(inputDeveloper);
                  }
                }}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {developers.map(email => (
                  <span
                    key={email}
                    className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                  >
                    {email}
                    <button
                      onClick={() => removeDeveloper(email)}
                      className="ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
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

export default InviteDevelopers;

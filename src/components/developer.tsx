import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';
import { DEFAULT_LANGUAGE } from '@/constants/sidebar-options';
import { useUser } from '@/context/user-context';
import { useCreateRoom } from '@/hooks/database-query/use-create-room';
import { useSendEmails } from '@/hooks/use-send-emails';
import { Room } from '@/types/room';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const InviteDevelopers = () => {
  const [developers, setDevelopers] = useState<string[]>([]);
  const [inputDeveloper, setInputDeveloper] = useState('');
  const [isPrivate, setIsPrivate] = useState<boolean | undefined>(undefined);
  const { userDetails } = useUser();
  const { mutate: createRoomMutation, isPending, isError } = useCreateRoom();
  const { mutate: sendEmailsMutation } = useSendEmails();
  const navigate = useNavigate();

  const inviteUsers = (email: string, remove: boolean) => {
    if (remove) {
      setDevelopers(prev => prev.filter(e => e !== email));
    } else {
      if (developers.includes(email)) return;
      setDevelopers(prev => [...prev, email]);
      setInputDeveloper('');
    }
  };

  const handleCreateRoomAndInvite = async () => {
    if (isPrivate === undefined) {
      toast.error('Please select a room type.');
      return;
    }

    try {
      if (userDetails?.id === undefined) return;

      // Create Room
      createRoomMutation(
        {
          ownerUuid: userDetails.id,
          isPrivate,
          invitedUsers: developers,
          lastLanguage: DEFAULT_LANGUAGE.value,
        },
        {
          onSuccess: (room: Room) => {
            const roomId = room.id;

            sendEmailsMutation(
              {
                intervieweeEmails: developers,
                interviewerEmails: [],
                roomId,
              },
              {
                onSuccess: (rejectedEmails: {
                  message: string;
                  failedEmails?: string[];
                }) => {
                  if (rejectedEmails.failedEmails?.length) {
                    toast.error('Some emails failed to send.', {
                      description: `Failed to send invites to: ${rejectedEmails.failedEmails.join(', ')}`,
                    });
                  } else {
                    toast.success('Room created and invitations sent!');
                    navigate(`${ROUTES.EDITOR}/${roomId}`);
                  }
                },
                onError: (error: Error) => {
                  toast.error('Error sending email invites', {
                    description: error.message,
                  });
                },
              },
            );
          },
          onError: (error: Error) => {
            toast.error('Error creating room', {
              description: error.message,
            });
          },
        },
      );
    } catch (error: any) {
      console.error(error);
      toast.error('Something went wrong.', {
        description: error.message,
      });
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
              <form
                className="flex items-center gap-5"
                onSubmit={e => {
                  e.preventDefault();
                  inviteUsers(inputDeveloper, false);
                }}
              >
                <Input
                  className="bg-[#1e272e] border-gray-600 text-white"
                  placeholder="Type email and press Enter"
                  value={inputDeveloper}
                  type="email"
                  onChange={e => setInputDeveloper(e.target.value)}
                />
                <Button
                  variant={'outline'}
                  className="text-black hover:text-white hover:bg-black active:scale-105 transition-all duration-200"
                  disabled={!inputDeveloper.trim()}
                  type="submit"
                >
                  Add Email
                </Button>
              </form>
              <div className="flex flex-wrap gap-2 mt-3">
                {developers.map((email, inx) => (
                  <span
                    key={inx}
                    className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full flex justify-center items-center gap-1 text-sm"
                  >
                    <p className="text-center">{email}</p>
                    <button
                      onClick={() => inviteUsers(email, true)}
                      className="flex items-center justify-center"
                    >
                      <X />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              onClick={handleCreateRoomAndInvite}
              disabled={isPending && !isError}
              className="rounded-xl px-6 py-3 text-lg font-semibold text-[black] transition transform hover:scale-105 cursor-pointer flex-3"
              style={{
                background:
                  'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
              }}
            >
              {isPending && !isError ? 'Creating...' : 'Invite & Create Room'}
            </Button>

            <Select onValueChange={value => setIsPrivate(value === 'private')}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Room Type</SelectLabel>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteDevelopers;

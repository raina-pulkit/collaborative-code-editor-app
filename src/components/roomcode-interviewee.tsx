import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { Box, Container } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validate } from 'uuid';

export const RoomCodeComp = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>('');

  return (
    <Container className="bg-accent-foreground min-w-full min-h-screen !p-0 relative">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 98px)',
          textAlign: 'center',
          padding: '2rem',
          color: 'white',
        }}
      >
        <Card className="w-full max-w-md bg-[#393f4c] text-white shadow-xl rounded-2xl border border-gray-700 p-6">
          <CardHeader className="text-xl font-bold text-center mb-6">
            Enter Room Code to join the room
          </CardHeader>

          <form
            onSubmit={e => {
              e.preventDefault();
              if (validate(roomId)) navigate(`${ROUTES.EDITOR}/${roomId}`);
              else
                toast.error('Invalid room id', {
                  description: 'Please enter a valid room id',
                  descriptionClassName: 'text-white',
                  style: {
                    backgroundColor: 'red',
                    color: 'white',
                  },
                });
            }}
          >
            <CardContent className="flex flex-col gap-5">
              <Input
                placeholder="Enter room id"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                className="bg-white text-black"
              />

              <Button
                type="submit"
                className="w-full rounded-xl px-6 py-2 text-[black] font-semibold text-lg transition transform hover:scale-105"
                style={{
                  background:
                    'linear-gradient(to right, rgb(28, 156, 253), #60d0ff)',
                }}
              >
                Join Room
              </Button>
            </CardContent>
          </form>
        </Card>
      </Box>
    </Container>
  );
};
export default RoomCodeComp;

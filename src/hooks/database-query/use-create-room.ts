import { CreateRoomDto, Room } from '@/types/room';
import { useMutation } from '@tanstack/react-query';

const createRoom = async ({
  ownerUuid,
  isPrivate,
  invitedUsers,
  lastLanguage,
}: CreateRoomDto): Promise<Room> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Access-Control-Allow-Origin': '*',
    },
    mode: 'cors',
    body: JSON.stringify({
      ownerUuid,
      isPrivate,
      invitedUsers,
      lastLanguage,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create room');
  }

  const room: Room = await response.json();

  return room;
};

export const useCreateRoom = () => {
  return useMutation({
    mutationKey: ['createRoom'],
    mutationFn: async (createRoomDto: CreateRoomDto) =>
      createRoom(createRoomDto),
  });
};

import { UNAUTHORIZED_ERROR } from '@/constants/error';
import { Room } from '@/types/room';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

const checkRoomHelper = async (roomId: string): Promise<Room> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/room/${roomId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      mode: 'cors',
    },
  );

  if (!response.ok) {
    if (response.status === 500) localStorage.removeItem('accessToken');
    if (response.status === 401) throw new Error(UNAUTHORIZED_ERROR);
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: Room = await response.json();
  return data;
};

export const useHandleGetRoom = (
  roomId: string,
): UseQueryResult<Room | null> => {
  const room = useQuery({
    queryKey: ['getRoom'],
    queryFn: () => (roomId ? checkRoomHelper(roomId) : null),
  });

  return room;
};

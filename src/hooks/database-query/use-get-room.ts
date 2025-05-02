import { Room } from '@/types/room';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const getRoom = async (id: string): Promise<Room> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/room/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      mode: 'cors',
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch room data');
  }

  const room: Room = await response.json();

  return room;
};

export const useGetRoom = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error('Room ID is required');
  }

  return useQuery({
    queryKey: ['room', id],
    queryFn: async () => getRoom(id),
  });
};

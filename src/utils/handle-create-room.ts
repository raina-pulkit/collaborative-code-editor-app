import { UNAUTHORIZED_ERROR } from '@/constants/error';
import { CreateRoomDto, Room } from '@/types/room';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

const createRoomHelper = async (
  createRoomDto: CreateRoomDto,
): Promise<Room> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify(createRoomDto),
    mode: 'cors',
  });

  if (!response.ok) {
    if (response.status === 500) localStorage.removeItem('accessToken');
    if (response.status === 401) throw new Error(UNAUTHORIZED_ERROR);
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: Room = await response.json();
  return data;
};

export const useHandleCreateRoom = (
  createRoomDto: CreateRoomDto,
): UseQueryResult<Room | null> => {
  const room = useQuery({
    queryKey: ['createRoom'],
    queryFn: () =>
      createRoomDto && createRoomDto.ownerUuid
        ? createRoomHelper(createRoomDto)
        : null,
  });

  return room;
};

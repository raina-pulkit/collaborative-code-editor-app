import { useMutation } from '@tanstack/react-query';

const updateRoomToDeleted = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/room/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update room to deleted');
  }

  return response.json();
};

export const useEndRoom = () => {
  return useMutation({
    mutationKey: ['end-room'],
    mutationFn: updateRoomToDeleted,
  });
};

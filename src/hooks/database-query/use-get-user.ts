import { User } from '@/types/member-profile/user';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const getUserDetails = async (id: string): Promise<User> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/user/${id}`,
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
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: User = await response.json();
  return data;
};

export const useGetUser = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error('User ID is required');
  }

  return useQuery({
    queryKey: ['getUser', id],
    queryFn: () => getUserDetails(id),
  });
};

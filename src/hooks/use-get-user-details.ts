import { UNAUTHORIZED_ERROR } from '@/constants/error';
import { User } from '@/types/member-profile/user';
import { useQuery } from '@tanstack/react-query';

const fetchUserDetails = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/user/get-data`,
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

  const data: User = await response.json();
  return data;
};

export const useGetUserDetails = () => {
  return useQuery({
    queryKey: ['getUserDetails'],
    queryFn: fetchUserDetails,
  });
};

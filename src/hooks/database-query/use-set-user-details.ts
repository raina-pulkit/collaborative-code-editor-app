import { useMutation } from '@tanstack/react-query';

const updateUserDetails = async (userDetails: {
  id: string;
  name?: string;
  email?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
}) => {
  const { id, name, email, bio, gender } = userDetails;
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/user/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        name,
        email,
        bio,
        gender,
      }),
      mode: 'cors',
    },
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Error: ${err?.message || err.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const useSetUserDetails = () => {
  return useMutation({
    mutationKey: ['setUserDetails'],
    mutationFn: async (userDetails: {
      id: string;
      name?: string;
      email?: string;
      bio?: string;
      gender?: 'male' | 'female' | 'other';
    }) => updateUserDetails(userDetails),
  });
};

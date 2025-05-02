import { useMutation } from '@tanstack/react-query';

const handleLanguageChange = async ({
  roomId,
  lastLanguage,
}: {
  roomId: string;
  lastLanguage: string;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/room/${roomId}`,
    {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
        'Allow-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        lastLanguage,
      }),
    },
  );

  if (!response.ok) {
    const errorObj = await response.json();
    if (response.status === 400) {
      throw new Error(
        `${errorObj.statusCode}: Failed to update language - ${errorObj.message}`,
      );
    } else throw new Error('Failed to update language');
  }

  return response.json();
};

export const useHandleLanguageChange = () => {
  return useMutation({
    mutationFn: async (languageChangeDto: {
      roomId: string;
      lastLanguage: string;
    }) => handleLanguageChange(languageChangeDto),
  });
};

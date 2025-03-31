import { useSuspenseQuery } from '@tanstack/react-query';

const fetchAccessToken = async (code: string): Promise<string> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/github/callback`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
      mode: 'cors',
    },
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data }: { data: string } = await response.json();
  return data;
};

export const useGetAccessToken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  return useSuspenseQuery({
    queryKey: ['getAccessToken'],
    queryFn: async () => {
      if (!code) {
        throw new Error('Code parameter is missing in the URL');
      }
      return fetchAccessToken(code);
    },
  });
};

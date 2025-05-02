import { useMutation } from '@tanstack/react-query';

const sendEmailInvites = async (
  interviewees: string[],
  interviewers: string[],
  roomId: string,
): Promise<{ message: string; failedEmails?: string[] }> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/send-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    mode: 'cors',
    body: JSON.stringify({
      interviewees,
      interviewers,
      roomId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send email invites');
  }

  const data: { message: string; failedEmails?: string[] } =
    await response.json();

  return data;
};

export const useSendEmails = () => {
  return useMutation({
    mutationKey: ['send-emails'],
    mutationFn: async ({
      intervieweeEmails,
      interviewerEmails,
      roomId,
    }: {
      intervieweeEmails: string[];
      interviewerEmails: string[];
      roomId: string;
    }) => sendEmailInvites(intervieweeEmails, interviewerEmails, roomId),
  });
};

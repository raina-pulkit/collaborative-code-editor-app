import EditorPage from '@/components/editor-page';
import { ROUTES } from '@/constants/routes';
import { Room } from '@/types/room';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingPage } from './loading-page';

const EditorPageContainer = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) {
        setError('Room ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response: AxiosResponse<Room> = await axios.get(
          `${import.meta.env.VITE_API_URL}/v1/room/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          },
        );

        if (!response.data) {
          throw new Error('Room not found');
        }

        setRoom(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          toast.error('Authentication failed', {
            description: 'Please login again',
          });
          navigate(ROUTES.LOGIN);
          return;
        }

        const errorMessage =
          error.response?.data?.message || error.message || 'Unknown error';
        setError(errorMessage);
        toast.error('Failed to fetch room', {
          description: errorMessage,
          style: {
            backgroundColor: 'red',
            color: 'white',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate]); // Removed room from dependencies

  // Check for deleted room in a separate effect
  useEffect(() => {
    if (room && room.deletedAt) {
      toast.error('Room has been deleted', {
        description: 'Please create a new room',
      });
      navigate(ROUTES.HOME);
    }
  }, [room, navigate]);

  if (isLoading) {
    return <LoadingPage message="Loading your room..." />;
  }

  if (error || !room) {
    // We already showed a toast in the catch block
    navigate(ROUTES.HOME);
    return <></>;
  }

  return <EditorPage room={room} />;
};

export default EditorPageContainer;

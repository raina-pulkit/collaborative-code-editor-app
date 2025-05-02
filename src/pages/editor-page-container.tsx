import EditorPage from '@/components/editor-page';
import { ROUTES } from '@/constants/routes';
import { useGetRoom } from '@/hooks/database-query/use-get-room';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingPage } from './loading-page';

const EditorPageContainer = () => {
  const { data: room, isLoading, error } = useGetRoom();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingPage message="Loading your room..." />;
  }

  if ((!isLoading && error) || !room) {
    toast.error('Room not found. Redirecting to home page.', {
      description: error?.message || 'Please try again later.',
      style: {
        backgroundColor: 'red',
        color: 'white',
      },
    });
    navigate(ROUTES.HOME);
    return <></>;
  }

  return <EditorPage room={room} />;
};

export default EditorPageContainer;

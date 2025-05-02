import { EditProfile } from '@/components/edit-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { useGetUser } from '@/hooks/database-query/use-get-user';
import { Container } from '@mui/material';
import { HomeIcon, Mail } from 'lucide-react';
import { JSX } from 'react';
import { FaPersonRifle } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingPage } from './loading-page';

const nameInitials = (name: string) => {
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ')[1] || '';
  return `${firstName[0]}${lastName[0] || firstName[1]}`;
};

const ProfilePage = (): JSX.Element => {
  const { data: user, isLoading, isError, refetch } = useGetUser();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingPage message="Loading Member Data..." />;
  }

  if (isError) {
    toast.error('Error fetching user data. Please try again later.', {
      description: 'If the problem persists, please contact support.',
      duration: 5000,
      action: <Button onClick={() => navigate(ROUTES.HOME)}>Go Home</Button>,
    });
  }

  return (
    <Container className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      <Button
        className="absolute top-4 left-4 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out border-black border-1 hover:bg-black hover:text-white"
        variant="outline"
        onClick={() => navigate(ROUTES.HOME)}
      >
        <HomeIcon />
      </Button>
      <Avatar className="w-48 h-48 shadow-lg mb-4">
        <AvatarImage src={user?.avatarUrl} />
        <AvatarFallback>{nameInitials(user?.name || 'D U')}</AvatarFallback>
      </Avatar>
      {user?.name && <div className="text-4xl shadow-2xl">{user.name}</div>}
      {user?.githubUsername && (
        <div className="text-xl">{user.githubUsername}</div>
      )}
      {user?.bio && (
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-2">
            <FaPersonRifle /> Bio
          </Label>
          <Textarea
            disabled
            className="min-w-96 border-5 border-black"
            value={user.bio}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Mail />{' '}
        {user && user?.email !== undefined && user?.email === null
          ? 'Mail is not set yet'
          : user?.email}
      </div>

      <EditProfile refetch={refetch} id={`${user?.githubId}`} />
    </Container>
  );
};

export default ProfilePage;

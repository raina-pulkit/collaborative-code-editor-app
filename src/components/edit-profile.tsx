import { useSetUserDetails } from '@/hooks/database-query/use-set-user-details';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const EditProfile = ({
  refetch,
  userName,
  userEmail,
  bio,
  gender,
  id,
}: {
  refetch: () => void;
  userName?: string;
  userEmail?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  id: string;
}) => {
  const [name, setName] = useState<string | undefined>(userName || undefined);
  const [email, setEmail] = useState<string | undefined>(
    userEmail || undefined,
  );
  const [bioText, setBioText] = useState<string | undefined>(bio || undefined);
  const [genderText, setGenderText] = useState<
    'male' | 'female' | 'other' | undefined
  >(gender);
  const { mutate: setUserDetails, isPending: isUpdating } = useSetUserDetails();

  const handleUpdateData = async () => {
    if (!name && !email && !genderText) return;
    setUserDetails(
      {
        name,
        email,
        bio: bioText,
        gender: genderText,
        id,
      },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="bg-black text-white cursor-pointer hover:text-black hover:bg-yellow-200 hover:border-black active:scale-95 transition-all duration-200 ease-in-out"
      >
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] bg-black text-white"
        onSubmit={() => {
          console.log('sdfasf');
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name || ''}
              className="col-span-3"
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={isUpdating}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email || ''}
              className="col-span-3"
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              disabled={isUpdating}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Input
              id="bio"
              value={bioText || ''}
              className="col-span-3"
              onChange={e => setBioText(e.target.value)}
              disabled={isUpdating}
              placeholder="Enter your bio"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select
              onValueChange={genderText => {
                if (['male', 'female', 'other'].includes(genderText))
                  setGenderText(genderText as 'male' | 'female' | 'other');
              }}
              disabled={isUpdating}
              defaultValue={genderText}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer hover:text-black hover:bg-yellow-200 hover:border-black active:scale-95 transition-all duration-200 ease-in-out"
            onClick={handleUpdateData}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

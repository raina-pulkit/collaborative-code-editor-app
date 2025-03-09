import { createContext, useContext } from 'react';

type User = {
  avatarUrl?: string;
  // Add other user properties as needed
};

interface UserContextType {
  userDetails: User | undefined;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = UserContext.Provider; 
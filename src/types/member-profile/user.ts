export interface User {
  id: string;
  githubUsername: string;
  githubId: number;
  email?: string;
  githubLink: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  followers: number;
  following: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  accessToken: string;
}

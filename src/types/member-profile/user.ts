export interface UserDetails {
  id: number;
  login: string;
  name: string;
  email: string;
  bio: string;
  gender: "male" | "female" | "other" | "";
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  accessToken: string;
}
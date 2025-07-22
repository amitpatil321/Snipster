export interface User {
  auth0Id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  bio: string | null;
}

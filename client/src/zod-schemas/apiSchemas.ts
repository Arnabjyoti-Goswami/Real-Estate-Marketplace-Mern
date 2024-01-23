import { string, z } from 'zod';

export const UserSchema = z.object({
  _id: string().min(1),
  username: string().min(1),
  email: string().min(4),
  avatar: string().min(10),
  createdAt: string().min(6),
  updatedAt: string().min(6),
});

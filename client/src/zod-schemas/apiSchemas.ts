import { string, z } from 'zod';

// for data validation in the jsx components
export const UserSchema = z.object({
  _id: string().min(1),
  username: string().min(1),
  email: string().min(4),
  avatar: string().min(10),
  createdAt: string().min(6),
  updatedAt: string().min(6),
});

// for typescript validation in the fetchHook
export type TUser = z.infer<typeof UserSchema>;

export type FetchFailure = {
  success: boolean;
  message: string;
};

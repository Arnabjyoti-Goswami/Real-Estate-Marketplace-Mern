import { z } from 'zod';

export const UserSchema = z.object({
  _id: z.string().min(1),
  username: z.string().min(1),
  email: z.string().min(4),
  avatar: z.string().min(10),
  createdAt: z.string().min(6),
  updatedAt: z.string().min(6),
});

export type TUser = z.infer<typeof UserSchema>;

export const ListingSchema = z.object({
  _id: z.string().min(1),
  userRef: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  regularPrice: z.number().min(0),
  discountPrice: z.number().min(0),
  bathrooms: z.number().min(1),
  bedrooms: z.number().min(1),
  furnished: z.boolean(),
  parking: z.boolean(),
  type: z.enum(['rent', 'sale']),
  offer: z.boolean(),
  imageUrls: z.array(z.string().min(1)),
});

export type TListing = z.infer<typeof ListingSchema>;

export const ForgotPasswordSchema = z.object({
  success: z.boolean(),
  message: z.string().min(1),
});

export type TForgotPassword = z.infer<typeof ForgotPasswordSchema>;

type FetchFailure = TForgotPassword;

export type TFetchHook = FetchFailure | TUser;

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

export const ListingsSchema = z.array(ListingSchema);

export type TListings = z.infer<typeof ListingsSchema>;

export const NoDataResSchema = z.object({
  success: z.boolean(),
  message: z.string().min(1),
});

export type TNoDataRes = z.infer<typeof NoDataResSchema>;

export type TGetApiRes = TNoDataRes | TUser | TListing;

type TPostBodyUpdateUser = {
  username: string;
  email: string;
  oldPassword: string;
  password: string;
  avatar: string;
};

type TPostBodyForgotPassword = {
  emailId: string;
};

export type TPostBodyListing = Omit<Omit<TListing, '_id'>, 'userRef'>;

type TBodyGoogleSignIn = {
  username: string;
  email: string;
  pfp: string;
};

type TPostBodyDeleteUser = {
  oldPassword: string;
};

type TPostBodyResetPassword = {
  token: string;
  newPassword: string;
};

type TPostBodyUserSignin = {
  email: string;
  password: string;
};

export type TPostBodyUserSignup = {
  email: string;
  password: string;
  username: string;
};

export type TPostBody =
  | TPostBodyForgotPassword
  | TPostBodyListing
  | TBodyGoogleSignIn
  | TPostBodyUpdateUser
  | TPostBodyDeleteUser
  | TPostBodyResetPassword
  | TPostBodyUserSignin
  | TPostBodyUserSignup;

export type TPostApiRes = TNoDataRes | TUser | TListing;

export type TDeleteApiRes = TNoDataRes;

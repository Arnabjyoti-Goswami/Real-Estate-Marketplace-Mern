import { defineConfig } from '@julr/vite-plugin-validate-env';
import { z } from 'zod';

export default defineConfig({
  validator: 'zod',
  schema: {
    VITE_FIREBASE_API_KEY: z.string().min(1),
    VITE_FIREBASE_APP_ID: z.string().min(1),
    VITE_FIREBASE_MESSAGE_SENDER_ID: z.string().min(1),
  },
});

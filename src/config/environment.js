import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUrl: process.env.MONGODB_URL,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  // Add other environment variables here
};

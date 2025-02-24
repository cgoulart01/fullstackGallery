export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL ?? '',
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ?? '',
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET ?? 'default-bucket',
  MONGO_URI: process.env.MONGO_URI ?? '',
};

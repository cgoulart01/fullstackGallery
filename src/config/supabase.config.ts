import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabaseFactory = (configService: ConfigService): SupabaseClient => {
  const supabaseUrl = configService.get<string>('SUPABASE_URL');
  const supabaseKey = configService.get<string>('SUPABASE_SECRET_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('⚠️ SUPABASE_URL e SUPABASE_SECRET_KEY são obrigatórios!');
  }

  return createClient(supabaseUrl, supabaseKey);
};

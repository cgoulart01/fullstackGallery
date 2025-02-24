import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './services/supabase.service';

@Module({
  imports: [ConfigModule], // 🔹 Importando ConfigModule para acessar variáveis do .env
  providers: [
    {
      provide: SupabaseClient,
      useFactory: (configService: ConfigService): SupabaseClient => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseKey = configService.get<string>('SUPABASE_SECRET_KEY');

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('⚠️ SUPABASE_URL e SUPABASE_SECRET_KEY são obrigatórios!');
        }

        return createClient(supabaseUrl, supabaseKey);
      },
      inject: [ConfigService],
    },
    SupabaseService, // 🔹 Agora o SupabaseService pode ser usado
  ],
  exports: [SupabaseService], // 🔹 Precisamos exportar para que outros módulos possam usá-lo
})
export class SupabaseModule { }

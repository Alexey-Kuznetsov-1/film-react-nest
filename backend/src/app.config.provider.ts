import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: {
    database: {
      driver: process.env.DATABASE_DRIVER || 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://localhost:5432/prac',
    },
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

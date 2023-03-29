import 'dotenv/config';
import { ConnectionOptions } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['dist/src/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/**/*.{ts,js}'],
  migrationsRun: true,
};

export default connectionOptions;

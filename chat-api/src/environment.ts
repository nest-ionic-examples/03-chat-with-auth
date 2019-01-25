import { parse } from 'dotenv';
import { readFileSync } from 'fs';

export interface Environment { // <1>
  MONGO_DB_URL: string;
  JWT_SECRET_PASSWORD: string;
}

export const environment: Environment =
  parse(readFileSync(`environments/${process.env.NODE_ENV || 'local'}.env`)) as any; // <2>

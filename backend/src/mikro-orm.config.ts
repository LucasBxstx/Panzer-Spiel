import {
  defineConfig,
  LoadStrategy,
  PopulateHint,
  PostgreSqlDriver,
} from '@mikro-orm/postgresql';
import { User } from './app/api/user/user.entity'; // all docker container

// setting for prod and development
const user = process.env.DB_USERNAME;
const port = parseInt(process.env.DB_PORT ?? '5432');
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const host = process.env.DB_HOST ?? 'db';

export default defineConfig({
  driver: PostgreSqlDriver,
  user,
  password,
  host,
  dbName,
  port,
  schema: 'public',
  debug: true,
  entities: [User],
  subscribers: [],
  multipleStatements: true,
  discovery: {
    disableDynamicFileAccess: true,
  },
  loadStrategy: LoadStrategy.JOINED,
  populateWhere: PopulateHint.INFER,
  preferTs: true,
  migrations: {
    snapshot: false,
    path: './dist/migrations',
  },
  autoJoinRefsForFilters: false,
  allowGlobalContext: true,
});

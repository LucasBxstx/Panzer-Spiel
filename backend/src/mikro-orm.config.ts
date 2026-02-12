import {
  defineConfig,
  LoadStrategy,
  PopulateHint,
  PostgreSqlDriver,
} from '@mikro-orm/postgresql';
import { User } from './app/api/user/user.entity'; // all docker container

// all docker container
// const user = 'finances-admin';
// const port = 5432;
// const password = 'myFinanceStats';
// const dbName = 'financesDB';
// const host = 'db';

const user = process.env.DB_USERNAME;
const port = parseInt(process.env.DB_PORT ?? '5432');
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const host = process.env.DB_HOST ?? 'db';

// only db docker
// const user = 'finances-admin';
// const port = 5434;
// const password = 'myFinanceStats';
// const dbName = 'financesDB';
// const host = '127.0.0.1';

// no docker, local development
// const user = 'postgres';
// const port = 5432;
// const password = 'xXLucas3Xx';
// const dbName = 'TestPostgreSQL';
// const host = '127.0.0.1';

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

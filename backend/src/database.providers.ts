import { createPool } from 'mysql2/promise';

export const databaseProviders = [
  {
    provide: 'DB_CONNECTION',
    useFactory: async () =>
      createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'meubanco',
      }),
  },
];
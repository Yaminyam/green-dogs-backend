import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export interface IOrmconfig {
  ormconfig: ConnectionOptions;
}

export const ormconfig = (): IOrmconfig => ({
  ormconfig: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '../../../../**/*.entity{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),

    timezone: 'Z', // UTC

    synchronize: false,
    migrationsRun: true,
    logging: process.env.NODE_ENV === 'dev',

    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  },
});

export default ormconfig().ormconfig;

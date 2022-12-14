import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { init1643517276502 } from './migrations/1643517276502-init';
import { addNotificationArticleid1644422087542 } from './migrations/1644422087542-add_notification_articleid';
import { addCategoryRoles1644473307391 } from './migrations/1644473307391-add_category_roles';
import { intraAuth1645622620898 } from './migrations/1645622620898-intra-auth';
import { addGuest1658252663130 } from './migrations/1658252663130-add-guest';

init1643517276502;
addNotificationArticleid1644422087542;
addCategoryRoles1644473307391;
intraAuth1645622620898;
addGuest1658252663130;

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

    synchronize: true,
    migrationsRun: true,
    logging: process.env.NODE_ENV === 'dev',

    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/database/migrations',
    },
  },
});

export default ormconfig().ormconfig;

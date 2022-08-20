import { DatabaseModule } from '@app/common/database/database.module';
import { ormconfig } from '@app/common/database/ormconfig';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubTaskSeederModule } from './subtask/subtask-seeder.module';
import { TaskSeederModule } from './task/task-seeder.module';
import { Seeder } from './seeder';
import { UserSeederModule } from './user/user-seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'infra/config/.env',
      isGlobal: true,
      cache: true,
      load: [ormconfig],
    }),
    DatabaseModule.register(),
    UserSeederModule,
    TaskSeederModule,
    SubTaskSeederModule,
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}

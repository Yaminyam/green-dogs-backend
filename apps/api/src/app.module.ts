import { AppController } from '@api/app.controller';
import { TaskModule } from '@api/task/task.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { ormconfig } from '@app/common/database/ormconfig';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'infra/config/.env',
      isGlobal: true,
      cache: true,
      load: [ormconfig],
    }),

    DatabaseModule.register(),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

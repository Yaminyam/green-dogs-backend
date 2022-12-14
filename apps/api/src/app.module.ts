import { AppController } from '@api/app.controller';
import { AuthModule } from '@api/auth/auth.module';
import { JwtAuthGuard } from '@api/auth/jwt-auth.guard';
import { CategoryModule } from '@api/category/category.module';
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY } from '@api/image/image.constant';
import { ImageModule } from '@api/image/image.module';
import { NotificationModule } from '@api/notification/notification.module';
import { ReactionModule } from '@api/reaction/reaction.module';
import { TaskModule } from '@api/task/task.module';
import { UserModule } from '@api/user/user.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { ormconfig } from '@app/common/database/ormconfig';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AwsSdkModule } from 'nest-aws-sdk';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'infra/config/.env',
      isGlobal: true,
      cache: true,
      load: [ormconfig],
    }),

    DatabaseModule.register(),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            region: configService.get(AWS_REGION),
            accessKeyId: configService.get(AWS_ACCESS_KEY),
            secretAccessKey: configService.get(AWS_SECRET_KEY),
          };
        },
      },
    }),
    UserModule,
    CategoryModule,
    NotificationModule,
    AuthModule,
    ReactionModule,
    ImageModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { MediaModule } from './media/media.module';
import { RolesModule } from './roles/roles.module';
import { FacultyModule } from './faculty/faculty.module';
import { StatusModule } from './status/status.module';
import { PeriodModule } from './period/period.module';
import { SubmissionModule } from './submission/submission.module';
import { CommentModule } from './comment/comment.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    AuthModule,
    AccountModule,
    MediaModule,
    RolesModule,
    FacultyModule,
    StatusModule,
    PeriodModule,
    SubmissionModule,
    CommentModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

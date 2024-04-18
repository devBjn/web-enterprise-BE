import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { Comment } from 'src/comment/entity/comment.entity';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Feedback } from 'src/feedback/entity/feedback.entity';
import { Period } from 'src/period/entity/period.entity';
import { Roles } from 'src/roles/entity/roles.entity';
import { Status } from 'src/status/entity/status.entity';
import { Submissions } from 'src/submission/entity/submission.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      Account,
      Roles,
      Faculty,
      Status,
      Period,
      Submissions,
      Comment,
      Feedback,
    ],
    synchronize: true,
  }),
);

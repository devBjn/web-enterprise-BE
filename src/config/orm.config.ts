import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Roles } from 'src/roles/entity/roles.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Account, Roles, Faculty],
    synchronize: true,
  }),
);

import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { RoleName } from 'src/roles/entity/roles.entity';

export class CreateAccountClientRequest {
  @Length(5)
  @IsNotEmpty()
  username: string;

  @Length(2)
  @IsNotEmpty()
  firstName: string;

  @Length(2)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  faculty: string;

  @IsNotEmpty()
  roles: RoleName;
}

export class CreateStudentRequest {
  @Length(5)
  @IsNotEmpty()
  username: string;

  @Length(2)
  @IsNotEmpty()
  firstName: string;

  @Length(2)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

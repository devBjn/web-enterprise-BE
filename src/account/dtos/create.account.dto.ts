import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Roles } from 'src/roles/entity/roles.entity';
// import { Role } from 'src/roles/constants';

export class CreateAccountRequest {
  @Length(5)
  @IsNotEmpty()
  username: string;

  @Length(8)
  @IsNotEmpty()
  password: string;

  @Length(8)
  @IsNotEmpty()
  retypedPassword: string;

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
}

export class GetAccountResponse {
  @IsString()
  id: string;

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

  @IsString()
  token?: string;

  roles?: Roles;

  faculty?: Faculty;

  avatar?: string;

  //date of birth
  dob?: string;

  phone?: string;

  address?: string;
}

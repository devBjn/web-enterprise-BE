import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailAccountRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

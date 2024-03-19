import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { RoleName } from 'src/roles/entity/roles.entity';

export class UpdateRoleAccountRequest {
  roleName: RoleName;
}

export class UpdateAccountRequest {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  dob: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  avatar: string;
}

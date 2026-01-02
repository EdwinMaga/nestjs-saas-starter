import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateInvitationDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'USER', 
    enum: Role,
    required: false,
    default: 'USER'
  })
  @IsOptional()
  @IsEnum(Role)
  role?: 'USER' | 'ADMIN';
}

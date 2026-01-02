import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength, IsOptional } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6' })
  @IsUUID()
  token: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

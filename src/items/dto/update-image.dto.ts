import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateImageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  url?: string;
}
import { IsString, IsNotEmpty, IsUrl } from "class-validator";


export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

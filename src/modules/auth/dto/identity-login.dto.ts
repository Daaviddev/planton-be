import { IsString, IsNotEmpty } from 'class-validator';

export class IdentityLoginDto {
  @IsString()
  @IsNotEmpty()
  identityToken: string;
}

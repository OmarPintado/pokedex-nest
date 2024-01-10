import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  no: number;

  @IsString()
  @MinLength(1)
  name: string;
}

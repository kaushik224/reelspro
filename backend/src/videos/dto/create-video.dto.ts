import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, Min, Max, MaxLength, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2048)
  videoUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2048)
  thumbnailUrl: string;

  @IsOptional()
  @IsBoolean()
  controls?: boolean;

  @IsOptional()
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

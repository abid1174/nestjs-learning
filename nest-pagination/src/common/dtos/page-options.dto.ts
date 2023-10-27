import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

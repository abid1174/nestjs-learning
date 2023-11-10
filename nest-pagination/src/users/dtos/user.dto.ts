import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  public first_name: string;

  @ApiProperty()
  public last_name: string;
}

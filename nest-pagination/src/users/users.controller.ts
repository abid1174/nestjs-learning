import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PageDto, PageOptionsDto } from 'src/common/dtos';
import { UserDto } from './dtos';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this._usersService.getUsers(pageOptionsDto);
  }
}

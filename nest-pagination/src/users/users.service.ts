import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/dtos';
import { UserDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  public async getUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this._userRepository.createQueryBuilder('user');

    queryBuilder
      .orderBy('user.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}

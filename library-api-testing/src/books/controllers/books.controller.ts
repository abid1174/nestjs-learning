import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { Book } from '../schemas/book.schema';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard())
  async createBook(@Req() req, @Body() bookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(bookDto, req.user);
  }

  @Get(':id')
  async getBook(@Param('id') id: string): Promise<Book> {
    return this.booksService.findById(id);
  }

  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.booksService.findAll(query);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.updateById(id, book);
  }

  @Delete('id')
  async deleteBook(@Param('id') id: string) {
    return this.booksService.deleteById(id);
  }
}

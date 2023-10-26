import mongoose, { Model } from 'mongoose';
import { BooksService } from './books.service';
import { Book, Category } from './schemas/book.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from 'src/auth/schemas/user.schema';

describe('BookService', () => {
  let bookService: BooksService;
  let model: Model<Book>;

  const mockBook = {
    _id: '65259548276075bfa843de6f',
    title: 'new book 11',
    description: 'New book 1 description here',
    author: 'Author 1',
    price: 100,
    category: Category.ADVENTURE,
    user: '652590280fbefd0aab4865c1',
  };

  const mockUser = {
    _id: '652590280fbefd0aab4865c1',
    name: 'abid',
    email: 'abid@gmail.com',
  };

  const mockBookService = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BooksService>(BooksService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const newBook = {
        title: 'new book 11',
        description: 'New book 1 description here',
        author: 'Author 1',
        price: 100,
        category: Category.ADVENTURE,
      };

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockBook as any));

      const result = await bookService.create(
        newBook as CreateBookDto,
        mockUser as User,
      );

      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const query = { page: '1', keyword: 'test' };
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockBook]),
            }),
          }) as any,
      );
      const result = await bookService.findAll(query);
      expect(result).toEqual([mockBook]);
      expect(model.find).toHaveBeenLastCalledWith({
        title: { $regex: 'test', $options: 'i' },
      });
    });
  });

  describe('findById', () => {
    it('should find and return a book by Id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);
      const result = await bookService.findById(mockBook._id);
      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it('should throw bad request exception if invalid id provided', async () => {
      const id = 'invalid-id';
      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);
      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );
      expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      await expect(bookService.findById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });
});

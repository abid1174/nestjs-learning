import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../schemas/book.schema';
import { BooksService } from '../services/books.service';
import { BooksController } from './books.controller';
import { PassportModule } from '@nestjs/passport';

describe('BooksController', () => {
  let booksService: BooksService;
  let booksController: BooksController;

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
    findAll: jest.fn().mockResolvedValueOnce([mockBook]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
    booksController = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(booksController).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should get all books', async () => {
      const result = await booksController.getAllBooks({
        page: '1',
        keyword: 'test',
      });

      expect(booksService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });
});

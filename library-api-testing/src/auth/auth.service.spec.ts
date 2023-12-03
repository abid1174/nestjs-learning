import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  const mockUser = {
    _id: '652590280fbefd0aab4865c1',
    name: 'abid',
    email: 'abid@gmail.com',
  };

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const token = 'jwtToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto = {
      name: 'abid',
      email: 'abid@gmail.com',
      password: '123456',
    };

    it('should register a new user', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedPassword'));

      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser as any));

      jest.spyOn(jwtService, 'sign').mockImplementation(() => 'jwtToken');

      const result = await authService.singup(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should throw duplicate email error', async () => {
      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 }));

      await expect(authService.singup(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'abid@gmail.com',
      password: '123456',
    };

    it('should login user and return token', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await authService.login(loginDto);
      expect(result).toEqual({ token });
    });

    it('should throw unauthorized exception if user not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
      expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw unauthorized exception if password wrong', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

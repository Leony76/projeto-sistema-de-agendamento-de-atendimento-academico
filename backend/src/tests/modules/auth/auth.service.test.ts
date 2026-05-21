import { authRepositoryMock } from '@backend/tests/mocks/repository/auth.repository.mock';
import { bcryptMock } from '@backend/tests/mocks/bcrypt.mock';
import { jwtMock } from '@backend/tests/mocks/jwt.mock';

jest.mock('@backend/modules/auth/auth.repository', () => ({
  AuthRepository: authRepositoryMock,
}));

jest.mock('@backend/modules/mail/mail.service', () => ({
  MailService: {
    sendTemporaryPasswordEmail: jest.fn(),
  },
}));

jest.mock('@backend/lib/jwt', () => ({
  generateToken: jwtMock.generateToken,
}));

jest.mock('bcrypt', () => bcryptMock);

import { AuthService } from '@backend/modules/auth/auth.service';
import { AuthRepository } from '@backend/modules/auth/auth.repository';
import { ApiError } from '@backend/utils/apiError.util';
import { makeRegisteredStudent, makeStudentRegisterRequest } from '@backend/tests/factories/student.factory';

describe('AuthService.studentRegistersHimself', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve cadastrar um aluno com sucesso', async () => {

    authRepositoryMock.emailAlreadyTaken
      .mockResolvedValue(false);

    authRepositoryMock.raAlreadyTaken
      .mockResolvedValue(false);

    bcryptMock.hash
      .mockResolvedValue('hashed-password');

    authRepositoryMock.registerStudent
      .mockResolvedValue(makeRegisteredStudent());

    jwtMock.generateToken
      .mockReturnValue('fake-token');

    const response = await AuthService.studentRegistersHimself(
      makeStudentRegisterRequest()
    );

    expect(response).toEqual({
      token: 'fake-token',

      user: expect.objectContaining({
        name: 'Leony',
        email: 'leony@gmail.com',
        ra: '123456',
        role: 'STUDENT',
      }),
    });

    expect(AuthRepository.registerStudent)
      .toHaveBeenCalledWith({
        name: 'Leony',
        email: 'leony@gmail.com',
        password: 'hashed-password',
        ra: '123456',
      });
  });

  it('deve lançar erro se email já existir', async () => {

    authRepositoryMock.emailAlreadyTaken
      .mockResolvedValue(true);

    await expect(
      AuthService.studentRegistersHimself(
        makeStudentRegisterRequest()
      )
    ).rejects.toThrow(ApiError);
  });
});
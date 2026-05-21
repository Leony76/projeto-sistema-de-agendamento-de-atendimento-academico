import { ApiError } from '@backend/utils/apiError.util';
import { disciplineRepositoryMock } from '@backend/tests/mocks/repository/discipline.repository.mock';

jest.mock('@backend/modules/discipline/disciplines.repository', () => ({
  DisciplineRepository: disciplineRepositoryMock,
}));

import { DisciplineRepository } from '@backend/modules/discipline/disciplines.repository'; 
import { DisciplineService } from '@backend/modules/discipline/discipline.service'; 

import {
  makeDiscipline,
  makeDisciplineNames,
} from '@backend/tests/factories/discipline.factory';

describe('DisciplineService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNames', () => {

    it('deve retornar apenas nomes', async () => {

      disciplineRepositoryMock.getNames
        .mockResolvedValue(makeDisciplineNames());

      const response = await DisciplineService.getNames();

      expect(response).toEqual([
        'Matemática',
        'Física',
        'Química',
      ]);

      expect(DisciplineRepository.getNames)
        .toHaveBeenCalledTimes(1);
    });
  });



  describe('getUnboundNames', () => {

    it('deve retornar disciplinas sem professor vinculados', async () => {

      disciplineRepositoryMock.getUnboundNames
        .mockResolvedValue([
          { name: 'Matemática' },
          { name: 'Física' },
        ]);

      const response = await DisciplineService.getUnboundNames();

      expect(response).toEqual([
        'Matemática',
        'Física',
      ]);
    });
  });



  describe('add', () => {

    it('deve adicionar disciplina com sucesso', async () => {

      disciplineRepositoryMock.disciplineAlreadyRegistered
        .mockResolvedValue(false);

      disciplineRepositoryMock.addDiscipline
        .mockResolvedValue(
          makeDiscipline()
        );

      const response = await DisciplineService.add('Matemática');

      expect(response).toBe('Matemática');

      expect(DisciplineRepository.addDiscipline)
        .toHaveBeenCalledWith('Matemática');
    });

    it('deve lançar erro se disciplina já existir', async () => {

      disciplineRepositoryMock.disciplineAlreadyRegistered
        .mockResolvedValue(true);

      await expect(
        DisciplineService.add('Matemática')
      ).rejects.toThrow(ApiError);

      expect(DisciplineRepository.addDiscipline)
        .not.toHaveBeenCalled();
    });
  });
});
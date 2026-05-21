import type { Request, Response } from 'express';

jest.mock('@backend/modules/discipline/discipline.service', () => ({
  DisciplineService: {
    getNames: jest.fn(),
    getUnboundNames: jest.fn(),
    add: jest.fn(),
  },
}));

import { DisciplineController } from '@backend/modules/discipline/discipline.controller';
import { DisciplineService } from '@backend/modules/discipline/discipline.service'; 

describe('DisciplineController', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNames', () => {

    it('deve retornar status 200', async () => {

      const req = {} as Request;

      const json = jest.fn();

      const res = {
        status: jest.fn().mockReturnThis(),
        json,
      } as unknown as Response;

      (DisciplineService.getNames as jest.Mock)
        .mockResolvedValue([
          'Matemática',
          'Física',
        ]);

      await DisciplineController.getNames(req, res);

      expect(res.status)
        .toHaveBeenCalledWith(200);

      expect(json)
        .toHaveBeenCalledWith([
          'Matemática',
          'Física',
        ]);
    });
  });



  describe('add', () => {

    it('deve adicionar disciplina', async () => {

      const req = {
        body: {
          name: 'Matemática',
        },
      } as Request;

      const json = jest.fn();

      const res = {
        status: jest.fn().mockReturnThis(),
        json,
      } as unknown as Response;

      (DisciplineService.add as jest.Mock)
        .mockResolvedValue('Matemática');

      await DisciplineController.add(req, res);

      expect(res.status)
        .toHaveBeenCalledWith(201);

      expect(json)
        .toHaveBeenCalledWith({
          data: 'Matemática',
          message: 'Disciplina adicionada com sucesso!',
          success: true,
        });
    });
  });
});
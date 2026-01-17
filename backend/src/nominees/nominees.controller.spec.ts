import { Test, TestingModule } from '@nestjs/testing';
import { NomineesController } from './nominees.controller';

describe('NomineesController', () => {
  let controller: NomineesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NomineesController],
    }).compile();

    controller = module.get<NomineesController>(NomineesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

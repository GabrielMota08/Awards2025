import { Test, TestingModule } from '@nestjs/testing';
import { NomineesService } from './nominees.service';

describe('NomineesService', () => {
  let service: NomineesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NomineesService],
    }).compile();

    service = module.get<NomineesService>(NomineesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

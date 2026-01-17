import { Module } from '@nestjs/common';
import { NomineesController } from './nominees.controller';
import { NomineesService } from './nominees.service';
import { DatabaseModule } from 'src/database/database.module';
import { NomineeRepository } from './repositories/nominee.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [NomineesController],
  providers: [NomineesService, NomineeRepository]
})
export class NomineesModule {}

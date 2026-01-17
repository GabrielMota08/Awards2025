import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { NomineeDto } from './dto/nominee.dto';
import { NomineesService } from './nominees.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('nominees')
@UseGuards(AuthGuard('jwt'))
export class NomineesController {
    constructor(private readonly nomineesService: NomineesService) {}

    @Post()
    createNominee(@Body() nomineeDto: NomineeDto, @Req() req){
        return this.nomineesService.createNominee(nomineeDto, req.user.userId)
    }

    @Put(':id')
    updateNominee(@Param('id') id: number, @Body() nomineeDto: NomineeDto, @Req() req){
        return this.nomineesService.updateNominee(id, nomineeDto, req.user.userId)
    }

    @Delete(':id')
    deleteNominee(@Param('id') id: number, @Req() req){
        return this.nomineesService.deleteNominee(id, req.user.userId)
    }
}

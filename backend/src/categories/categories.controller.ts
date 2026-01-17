import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CategorieDto } from './dto/categorie.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
    createCategorie(@Body() categorieDto: CategorieDto, @Req() req){
    return this.categoriesService.createCategorie(categorieDto, req.user.userId)
  }

  @Put(':id')
  updateCategorie(@Param('id') id: number, @Body() categorieDto: CategorieDto, @Req() req){
    return this.categoriesService.updateCategorie(id, categorieDto, req.user.userId)
  }

  @Delete(':id')
  deleteCategorie(@Param('id') id: number, @Req() req){
    return this.categoriesService.deleteCategorie(id, req.user.userId)
  }
}

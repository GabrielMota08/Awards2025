import { Body, Controller, Get, Post, Put, Param, Headers, UseGuards, Req, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsService } from './groups.service';
import { GroupDto } from './dto/group.dto';

@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  getMyGroups(@Req() req) {
    return this.groupsService.getMyGroups(req.user.userId);
  }

  @Post()
  createGroup(@Body() groupDto: GroupDto, @Req() req) {
    return this.groupsService.createGroup(groupDto, req.user.userId);
  }

  @Put(':id')
  updateGroup(@Param('id') id: number, @Body() groupDto: GroupDto, @Req() req) {
    return this.groupsService.updateGroup(id, groupDto, req.user.userId);
  }

  // @Delete(':id') fazer
}
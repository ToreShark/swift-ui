import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { FindGroupDto } from './group.dto/group.dto';
import { PipelineStage } from 'mongoose';
import { GroupService } from './group.service';
import { Group } from './group.schema';
import { IGroup } from './interface/IGroup';
import { AuthType } from 'src/iam/authentication/enum/auth-type.enum';
import { Auth } from 'src/iam/authentication/decorator/auth.decorator';

@Auth(AuthType.None)
@Controller('Groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Group> {
    const findGroupDto = { id };
    try {
      const result =
        await this.groupsService.findByIdWithProducts(findGroupDto);
      if (!result) {
        throw new NotFoundException(`Group with id ${id} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching group with products:', error);
      throw new InternalServerErrorException(
        'Error fetching group with products',
      );
    }
  }
  @Get()
  async listAll(
    
  ): Promise<any[]> {
    // Изменено возвращаемое значение на Promise<any[]>
    try {
      const data = await this.groupsService.listAllGroups();
      return data;
      // Вызов метода listAllWithData
    } catch (error) {
      console.error('Error fetching all groups data:', error);
      throw new InternalServerErrorException('Error fetching all groups data');
    }
  }
}

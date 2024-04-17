import {Controller, Get, InternalServerErrorException, Param} from "@nestjs/common";
import {FindGroupDto} from "./group.dto/group.dto";
import {PipelineStage} from "mongoose";
import {GroupService} from "./group.service";
import {Group} from "./group.schema";
import {IGroup} from "./interface/IGroup";
import { AuthType } from "src/iam/authentication/enum/auth-type.enum";
import { Auth } from "src/iam/authentication/decorator/auth.decorator";

@Auth(AuthType.None)
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupService) {}

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Group> {
        const findGroupDto = { id }; // Предполагается, что у вас есть DTO с полем id
        try {
            const result = await this.groupsService.findByIdWithProducts(findGroupDto);
            return result;
        } catch (error) {
            console.error('Error fetching group with products:', error);
            throw new InternalServerErrorException('Error fetching group with products');
        }
    }
    @Get()
    async listAll(): Promise<any[]> { // Изменено возвращаемое значение на Promise<any[]>
        try {
            return await this.groupsService.listAllWithData(); // Вызов метода listAllWithData
        } catch (error) {
            console.error('Error fetching all groups data:', error);
            throw new InternalServerErrorException('Error fetching all groups data');
        }
    }
}
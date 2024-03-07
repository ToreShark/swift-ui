import {Controller, Get, InternalServerErrorException, Param} from "@nestjs/common";
import {FindGroupDto} from "./group.dto/group.dto";
import {PipelineStage} from "mongoose";
import {GroupService} from "./group.service";
import {Group} from "./group.schema";
import {IGroup} from "./interface/IGroup";

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
    async listAll(): Promise<IGroup[]> {
        return this.groupsService.listAllGroups();
    }
}
import {Controller, Get, InternalServerErrorException} from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Get('/groups')
    async seedGroups(): Promise<void> {
        try {
            await this.seedService.seedGroups();
            console.log('Seeding groups complete!');
        } catch (error) {
            console.error('Seeding groups failed:', error);
            throw new InternalServerErrorException('Seeding groups failed');
        }
    }
    @Get('/products')
    async seedProducts(): Promise<void> {
        try {
            await this.seedService.seedProducts();
            console.log('Seeding products complete!');
        } catch (error) {
            console.error('Seeding products failed:', error);
            throw new InternalServerErrorException('Seeding products failed');
        }
    }

    @Get('/filters')
    async seedFilters(): Promise<void> {
        try {
            await this.seedService.seedFilters();
            console.log('Seeding filters complete!');
        } catch (error) {
            console.error('Seeding filters failed:', error);
            throw new InternalServerErrorException('Seeding filters failed');
        }
    }
}
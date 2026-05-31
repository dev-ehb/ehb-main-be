import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PlatformKeyGuard } from '../auth/platform-key.guard';

/**
 * Service-to-service users endpoints. Today the only consumer is
 * ehb-backoffice, which calls /users/search?q=... to find an EHB user to
 * assign a franchise to. Guarded by PlatformKeyGuard (x-platform-key).
 */
@ApiTags('Users')
@Controller('users')
@UseGuards(PlatformKeyGuard)
@ApiSecurity('platform-key')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search EHB users by email or name (service-to-service)' })
  @ApiQuery({ name: 'q', required: true, example: 'john doe' })
  async search(@Query('q') q: string) {
    const users = await this.usersService.search(q ?? '');
    return users.map((u) => this.usersService.toPublic(u));
  }
}

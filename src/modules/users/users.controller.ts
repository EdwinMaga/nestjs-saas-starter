import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentOrg } from 'src/common/decorators/current-org.decorator';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  getAdminData() {
    return { message: 'Solo admins pueden ver esto' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('org')
  getOrgData(
    @CurrentUser() user: any,
    @CurrentOrg() orgId: string,
  ) {
    return {
      user,
      organizationId: orgId,
    };
  }
}

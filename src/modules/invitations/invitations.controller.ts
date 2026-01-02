import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateInvitationDto } from './dto/create-invitation.dto';

@ApiTags('Invitations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(private service: InvitationsService) {}

  @Roles('ADMIN')
  @Post()
  invite(
    @CurrentUser() user: any,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.service.createInvite(
      dto.email,
      dto.role ?? 'USER',
      user.organizationId,
    );
  }
}

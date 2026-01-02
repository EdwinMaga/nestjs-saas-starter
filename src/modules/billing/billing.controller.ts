import { Controller, Post, UseGuards, Headers, HttpCode, Req,} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { ApiBearerAuth, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private service: BillingService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('checkout')
  checkout(@CurrentOrg() orgId: string) {
    return this.service.createCheckout(orgId);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.service.handleWebhook(req.rawBody || req.body, signature);
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PLAN_KEY } from '../decorators/plan.decorator';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { Plan } from '../enums/plan.enum';

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlan = this.reflector.getAllAndOverride<Plan>(
      PLAN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPlan) return true;

    const req = context.switchToHttp().getRequest();
    const orgId = req.user?.organizationId;

    if (!orgId) {
      throw new ForbiddenException('Organization not found');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { plan: true },
    });

    if (!org || org.plan !== requiredPlan) {
      throw new ForbiddenException(
        `This feature requires ${requiredPlan} plan`,
      );
    }

    return true;
  }
}

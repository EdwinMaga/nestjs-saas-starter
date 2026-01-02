import { SetMetadata } from '@nestjs/common';
import { Plan } from '../enums/plan.enum';

export const PLAN_KEY = 'plan';
export const RequirePlan = (plan: Plan) =>
  SetMetadata(PLAN_KEY, plan);

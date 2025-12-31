import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { addDays } from 'date-fns';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async createInvite(
    email: string,
    role: 'USER' | 'ADMIN',
    organizationId: string,
  ) {
    const token = randomUUID();

    return this.prisma.invitation.create({
      data: {
        email,
        role,
        token,
        organizationId,
        expiresAt: addDays(new Date(), 7),
      },
    });
  }
}

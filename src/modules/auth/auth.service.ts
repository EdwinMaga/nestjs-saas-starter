import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);

    const organization = await this.prisma.organization.create({
      data: {
        name: `${name || 'Org'} Workspace`,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: 'ADMIN',
        organizationId: organization.id,
      },
    });

    return this.signToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user);
  }

  private signToken(user: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  }) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      }),
    };
  }

  async acceptInvite(data: {
    token: string;
    password: string;
    name?: string;
  }) {
    const invite = await this.prisma.invitation.findUnique({
      where: { token: data.token },
    });

    if (!invite || invite.accepted || invite.expiresAt < new Date()) {
      throw new ConflictException('Invalid or expired invite');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: invite.email,
        password: hashed,
        name: data.name,
        role: invite.role,
        organizationId: invite.organizationId,
      },
    });

    await this.prisma.invitation.update({
      where: { id: invite.id },
      data: { accepted: true },
    });

    return this.signToken(user);
  }
}

// filepath: backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: { email: string; password: string; }) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const [userId] = await this.knex('users').insert({
      email: registerDto.email,
      password: hashedPassword,
    });
    return { msg: 'User registered', userId };
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.knex('users').where({ email: loginDto.email }).first();
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
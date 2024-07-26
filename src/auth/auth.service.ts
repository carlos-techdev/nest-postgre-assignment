import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    // Check if the user with the email is already exist or not
    const user = await this.repo.findOne({ where: { email: dto.email } });
    if (!user) {
      // Generate the password hash
      const hash = await argon.hash(dto.password);
      try {
        // Save the New user in the db
        const user = await this.repo.create({
          email: dto.email,
          password: hash,
        });
        await this.repo.save(user);
        // Return the saved user
        // return this.signToken(user.id, user.email);
        return {
          msg: 'user created',
          data: user,
        };
      } catch (error) {
        throw error;
      }
    }
    throw new ForbiddenException('User with the email already exist');
  }

  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.repo.findOne({ where: { email: dto.email } });

    // if the user does not exists throw an exception
    if (!user) throw new ForbiddenException('User Does Not Exist');

    // compare the password
    const isPwMatch = await argon.verify(user.password, dto.password);

    // if the password is incorrect throw an exception
    if (!isPwMatch) throw new ForbiddenException('Invalid Credentials');

    // send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET || 'secret_key',
    });

    return {
      access_token: token,
    };
  }
}

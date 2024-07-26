import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  providers: [],
  controllers: [UserController],
})
export class UserModule {}

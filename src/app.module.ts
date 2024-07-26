import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { CatsModule } from './cats/cats.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Cat } from './cats/cat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    CoreModule,
    CatsModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'secret',
      database: 'cat',
      port: 5432,
      host: 'localhost',
      entities: [User, Cat],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: []
})

export class AppModule { }

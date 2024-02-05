import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from '@/schemas/User';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [],
  exports: [UsersService],
})
export class UsersModule {}

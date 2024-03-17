import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from '@/schemas/User';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    FilesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [],
  exports: [UsersService],
})
export class UsersModule {}

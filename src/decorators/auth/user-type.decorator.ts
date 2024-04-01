import { SetMetadata } from '@nestjs/common';
import { UserType } from '@/types/User';

export const USER_TYPE_KEY = 'userType';
export const UserTypes = (...userTypes: UserType[]) =>
  SetMetadata(USER_TYPE_KEY, userTypes);

import { Database, Resource } from '@adminjs/typeorm';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import AdminJS from 'adminjs';

import { PlaceEntity } from './place/entities';
import { UserEntity } from './user/entities/user.entity';
import { BookingEntity } from './booking/booking.entity';

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

export const DEFAULT_ADMIN = {
  email: 'admin@unit00.co',
  password: 'admin@unit00.co',
};

export const ADMIN_ROOT_PATH = '/admin';
export const ADMIN_COOKIE_PATH = 'adminjs';
export const ADMIN_SECRET = 'topsecret';

export const ADMIN_RESOURCES = [UserEntity, PlaceEntity, BookingEntity];

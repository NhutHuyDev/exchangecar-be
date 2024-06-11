import { SystemRole } from '@/constraints/systemRoles.enum.constraint';
import { SetMetadata } from '@nestjs/common';

export const ROLES = 'roles';
export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES, roles);

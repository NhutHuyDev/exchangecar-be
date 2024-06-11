import { SystemRole } from '@/constraints/systemRoles.enum.constraint';

export type JwtPayload = {
  authId: number;
  roles: SystemRole[];
};

import { JwtPayload } from '@/modules/auth/interfaces/jwtPayload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

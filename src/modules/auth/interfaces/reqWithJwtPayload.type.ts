import { JwtPayload } from './jwtPayload.interface';

export interface RequestWithJwtPayload extends Request {
  user: {
    jwtPayload: JwtPayload;
  };
}

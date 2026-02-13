import { User } from '../../api/user/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

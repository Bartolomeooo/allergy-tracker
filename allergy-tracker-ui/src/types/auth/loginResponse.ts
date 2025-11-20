import type {User} from '../user';

export type LoginResponse = {
  accessToken: string;
  user: User;
};

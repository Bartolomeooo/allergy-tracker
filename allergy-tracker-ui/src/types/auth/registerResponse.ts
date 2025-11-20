import type {User} from '../user';

export type RegisterResponse = {
  accessToken: string;
  user: User;
};

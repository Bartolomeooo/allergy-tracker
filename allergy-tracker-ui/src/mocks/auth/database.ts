import usersRaw from '../data/users.json';
import type {User} from '../../types/user';

let users = usersRaw as User[];

export const authDatabase = {
  getUserByEmail: (email: string) => users.find((u) => u.email === email),
  getUserById: (id: string) => users.find((u) => u.id === id),
  addUser: (u: User) => {
    users.push(u);
    return u;
  },
  _reset(newUsers?: User[]) {
    if (newUsers) users = newUsers;
  },
};

import { User } from '@domain/entities/user';

export interface IUserRepository {
  create(user: User): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
}

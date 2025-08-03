import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';

export class GetUserByEmail {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(email: string): Promise<User | null> {
    return await this.userRepo.getByEmail(email);
  }
}

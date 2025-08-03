import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { CreateUserDto } from '@application/dtos';
import { EmailAlreadyExistsError } from '@domain/errors';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.getByEmail(data.email);
    if (existingUser) {
       throw new EmailAlreadyExistsError(data.email);
    }

    const newUser = new User(
      '',
      data.name ?? '',
      data.email,
      data.role ?? 'user'
    );
    await this.userRepository.create(newUser);
    return newUser;
  }
}

import { User } from '@domain/entities';
import { IUserRepository } from '@domain/repositories/user.repository';
import { AuthResponseDto, CreateUserDto } from '@application/dtos';
import { EmailAlreadyExistsError } from '@domain/errors';
import { generateToken } from '@shared/utils';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDto): Promise<AuthResponseDto> {
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
    const user = await this.userRepository.create(newUser);

    const token = generateToken({ id: user.id, email: user.email });

    return { user, token };
  }
}

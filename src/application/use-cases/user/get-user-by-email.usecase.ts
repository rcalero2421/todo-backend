import { IUserRepository } from '@domain/repositories';
import { AuthResponseDto } from '@application/dtos';
import { UserNotFoundError } from '@domain/errors';
import { generateToken } from '@shared/utils';

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new UserNotFoundError(email);
    }

    const token = generateToken({ id: user.id, email: user.email });

    return { user, token };
  }
}

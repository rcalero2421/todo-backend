import { User } from '@domain/entities';

export interface AuthResponseDto {
  user: User;
  token: string;
}

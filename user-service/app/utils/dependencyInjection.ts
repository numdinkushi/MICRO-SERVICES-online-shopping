import { container } from 'tsyringe';
import { UserRepository } from 'app/repository/userRepository';

// Register the UserRepository as a singleton
container.register('UserRepository', { useClass: UserRepository });
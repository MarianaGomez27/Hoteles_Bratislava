import { Controller, Post, Body, Logger } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { Auth0UserDto } from './auth.types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  readonly logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('createUserFromAuth0')
  @Public()
  public async createUserFromAuth0(@Body() auth0UserDto: Auth0UserDto) {
    return await this.authService.createUserFromAuth0(auth0UserDto);
  }
}

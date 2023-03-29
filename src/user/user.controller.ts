import { Controller, Post, Body, Logger, Get, Req } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { UserService } from './user.service';
import { UpdateProfileDto, CreateUserToReviewDto } from './user.types';

@Controller('user')
export class UserController {
  readonly logger = new Logger('AuthController');

  constructor(private userService: UserService) {}

  @Get('profile')
  public async getUserProfile(@Req() req) {
    // Note: Req already contains the user from DB and information from JWT
    // See AuthGuard and JWT Strategy for the user extraction logic
    return req.user;
  }

  @Post('updateProfile')
  public async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.profile.id;
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @Post('createUserToReview')
  @Public()
  public async createUserToReview(
    @Body() createUserToReviewDto: CreateUserToReviewDto,
  ) {
    return this.userService.createUserToReview(createUserToReviewDto);
  }
}

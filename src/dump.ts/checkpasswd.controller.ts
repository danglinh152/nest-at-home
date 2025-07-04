import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('check-passwd')
export class TestsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async checkPasswd(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const user = await this.usersService.checkPasswd(email, password);
      return {
        ErrorCode: 0,
        data: user,
      };
    } catch (error) {
      return {
        ErrorCode: -1,
        data: null,
        message: error?.message || 'Unexpected error',
      };
    }
  }
}

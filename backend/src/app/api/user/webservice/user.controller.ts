import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/user.dto';
import { CurrentUserId } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@CurrentUserId() id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @CurrentUserId() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }
}

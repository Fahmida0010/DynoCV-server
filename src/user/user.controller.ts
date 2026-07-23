import { Controller, Get, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserService } from './user.service';

@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Patch(':id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.userService.updateRole(id, role);
  }

  @Patch(':id/block')
  async toggleBlockStatus(@Param('id') id: string, @Body('isBlocked') isBlocked: boolean) {
    return this.userService.toggleBlock(id, isBlocked);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
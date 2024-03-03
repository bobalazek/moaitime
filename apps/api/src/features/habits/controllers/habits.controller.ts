import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Habit } from '@moaitime/database-core';
import { habitsManager } from '@moaitime/database-services';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateHabitDto } from '../dtos/create-habit.dto';
import { UpdateHabitDto } from '../dtos/update-habit.dto';

@Controller('/api/v1/habits')
export class HabitsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Habit[]>> {
    const data = await habitsManager.list(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':habitId')
  async view(
    @Req() req: Request,
    @Param('habitId') habitId: string
  ): Promise<AbstractResponseDto<Habit>> {
    const data = await habitsManager.view(req.user.id, habitId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateHabitDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Habit>> {
    const data = await habitsManager.create(req.user, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':habitId')
  async update(
    @Req() req: Request,
    @Param('habitId') habitId: string,
    @Body() body: UpdateHabitDto
  ): Promise<AbstractResponseDto<Habit>> {
    const data = await habitsManager.update(req.user.id, habitId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':habitId')
  async delete(
    @Req() req: Request,
    @Param('habitId') habitId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Habit>> {
    const data = await habitsManager.delete(req.user.id, habitId, body.isHardDelete);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':habitId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('habitId') habitId: string
  ): Promise<AbstractResponseDto<Habit>> {
    const data = await habitsManager.undelete(req.user.id, habitId);

    return {
      success: true,
      data,
    };
  }
}

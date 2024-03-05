import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Habit } from '@moaitime/database-core';
import { habitsManager } from '@moaitime/database-services';
import { HabitDaily, isValidDate } from '@moaitime/shared-common';

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
  @Get('deleted')
  async listDeleted(@Req() req: Request): Promise<AbstractResponseDto<Habit[]>> {
    const data = await habitsManager.listDeleted(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('daily/:date')
  async daily(
    @Req() req: Request,
    @Param('date') date: string
  ): Promise<AbstractResponseDto<HabitDaily[]>> {
    if (!isValidDate(date)) {
      throw new Error('Invalid date');
    }

    const data = await habitsManager.daily(req.user.id, date);

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
  @Patch(':habitId/daily/:date')
  async dailyUpdate(
    @Req() req: Request,
    @Param('habitId') habitId: string,
    @Param('date') date: string,
    @Body() body: { amount: string }
  ): Promise<AbstractResponseDto> {
    if (!isValidDate(date)) {
      throw new Error('Invalid date');
    }

    const amount = parseInt(body.amount ?? '0');
    if (amount < 0) {
      throw new Error('Invalid amount');
    }

    const data = await habitsManager.dailyUpdate(req.user.id, habitId, date, amount);

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

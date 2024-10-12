import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Goal } from '@moaitime/database-core';
import { goalsManager } from '@moaitime/database-services';
import { GoalsListSortFieldEnum, SortDirectionEnum } from '@moaitime/shared-common';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateGoalDto } from '../dtos/create-goal.dto';
import { ReorderGoalsDto } from '../dtos/reorder-goals.dto';
import { UpdateGoalDto } from '../dtos/update-goal.dto';

@Controller('/api/v1/goals')
export class GoalsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Goal[]>> {
    const search = req.query.search as string;
    const sortField = req.query.sortField as GoalsListSortFieldEnum;
    const sortDirection = req.query.sortDirection as SortDirectionEnum;
    const includeDeleted = req.query.includeDeleted === 'true';

    const data = await goalsManager.list(req.user.id, {
      search,
      sortField,
      sortDirection,
      includeDeleted,
    });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('reorder')
  async reorder(@Body() body: ReorderGoalsDto, @Req() req: Request) {
    await goalsManager.reorder(req.user.id, body);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('deleted')
  async listDeleted(@Req() req: Request): Promise<AbstractResponseDto<Goal[]>> {
    const data = await goalsManager.listDeleted(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':goalId')
  async view(
    @Req() req: Request,
    @Param('goalId') goalId: string
  ): Promise<AbstractResponseDto<Goal>> {
    const data = await goalsManager.view(req.user.id, goalId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateGoalDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Goal>> {
    const data = await goalsManager.create(req.user, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':goalId')
  async update(
    @Req() req: Request,
    @Param('goalId') goalId: string,
    @Body() body: UpdateGoalDto
  ): Promise<AbstractResponseDto<Goal>> {
    const data = await goalsManager.update(req.user.id, goalId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':goalId')
  async delete(
    @Req() req: Request,
    @Param('goalId') goalId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Goal>> {
    const data = await goalsManager.delete(req.user.id, goalId, body.isHardDelete);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':goalId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('goalId') goalId: string
  ): Promise<AbstractResponseDto<Goal>> {
    const data = await goalsManager.undelete(req.user, goalId);

    return {
      success: true,
      data,
    };
  }
}

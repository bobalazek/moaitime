import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Task } from '@moaitime/database-core';
import { tasksManager } from '@moaitime/database-services';
import { SortDirectionEnum } from '@moaitime/shared-common';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { ReorderTasksDto } from '../dtos/reorder-tasks.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@Controller('/api/v1/tasks')
export class TasksController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Task[]>> {
    const query = req.query.query as string;
    const listId = req.query.listId as string;
    const includeCompleted = req.query.includeCompleted === 'true';
    const includeDeleted = req.query.includeDeleted === 'true';
    const sortField = req.query.sortField as keyof Task;
    const sortDirection = req.query.sortDirection as SortDirectionEnum;

    const data = await tasksManager.list(req.user.id, listId ?? null, {
      query,
      includeCompleted,
      includeDeleted,
      sortField,
      sortDirection,
    });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('reorder')
  async reorder(@Body() body: ReorderTasksDto, @Req() req: Request) {
    await tasksManager.reorder(req.user.id, body.listId, body);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':taskId')
  async view(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.view(req.user.id, taskId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateTaskDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.create(req.user, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':taskId')
  async update(
    @Req() req: Request,
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskDto
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.update(req.user, taskId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':taskId')
  async delete(
    @Req() req: Request,
    @Param('taskId') taskId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.delete(req.user.id, taskId, body.isHardDelete);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.undelete(req.user, taskId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/duplicate')
  async duplicate(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.duplicate(req.user.id, taskId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/complete')
  async complete(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.complete(req.user.id, taskId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/uncomplete')
  async uncomplete(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.uncomplete(req.user.id, taskId);

    return {
      success: true,
      data,
    };
  }
}

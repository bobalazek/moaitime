import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Task } from '@moaitime/database-core';
import { listsManager, tasksManager } from '@moaitime/database-services';
import { TASKS_MAX_PER_LIST_COUNT } from '@moaitime/shared-backend';
import { SortDirectionEnum } from '@moaitime/shared-common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { DeleteDto } from '../../core/dtos/delete.dto';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { ReorderTasksDto } from '../dtos/reorder-tasks.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@Controller('/api/v1/tasks')
export class TasksController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Task[]>> {
    const listId = req.query.listId as string;
    const list = listsManager.findOneByIdAndUserId(listId, req.user.id);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const includeCompleted = req.query.includeCompleted === 'true';
    const includeDeleted = req.query.includeDeleted === 'true';
    const sortField = req.query.sortField as keyof Task;
    const sortDirection = req.query.sortDirection as SortDirectionEnum;

    const data = await tasksManager.findManyByListId(listId, {
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
    const list = listsManager.findOneByIdAndUserId(body.listId, req.user.id);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const { sortDirection, listId, originalTaskId, newTaskId } = body;

    await tasksManager.reorder(listId, sortDirection, originalTaskId, newTaskId);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async view(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

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
    const list = await listsManager.findOneByIdAndUserId(body.listId, req.user.id);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const tasksCount = await tasksManager.countByListId(list.id);
    if (tasksCount >= TASKS_MAX_PER_LIST_COUNT) {
      throw new Error(
        `You have reached the maximum number of tasks per list (${TASKS_MAX_PER_LIST_COUNT}).`
      );
    }

    const maxOrderForListId = await tasksManager.findMaxOrderByListId(body.listId);
    const order = maxOrderForListId + 1;

    const data = await tasksManager.insertOne({ ...body, order });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    if (body.listId) {
      const list = listsManager.findOneByIdAndUserId(body.listId, req.user.id);
      if (!list) {
        throw new NotFoundException('List not found');
      }
    }

    const updatedData = await tasksManager.updateOneById(id, body);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = body.isHardDelete
      ? await tasksManager.deleteOneById(id)
      : await tasksManager.updateOneById(id, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/undelete')
  async undelete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.updateOneById(id, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/duplicate')
  async duplicate(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.duplicate(id);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/complete')
  async complete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.updateOneById(id, {
      completedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/uncomplete')
  async uncomplete(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.updateOneById(id, {
      completedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}

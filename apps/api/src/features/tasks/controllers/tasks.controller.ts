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

import { List, Task } from '@moaitime/database-core';
import { listsManager, tasksManager, usersManager } from '@moaitime/database-services';
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
    if (query) {
      const data = await tasksManager.findManyByQueryAndUserId(query, req.user.id);
      return {
        success: true,
        data,
      };
    }

    const listId = req.query.listId as string;
    const list = listsManager.findOneByIdAndUserId(listId, req.user.id);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const includeCompleted = req.query.includeCompleted === 'true';
    const includeDeleted = req.query.includeDeleted === 'true';
    const sortField = req.query.sortField as keyof Task;
    const sortDirection = req.query.sortDirection as SortDirectionEnum;

    const tags = await tasksManager.findManyByListId(listId, {
      includeCompleted,
      includeDeleted,
      sortField,
      sortDirection,
    });
    const data = await this._populateTags(tags);

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
  @Get(':taskId')
  async view(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const row = await tasksManager.findOneByIdAndUserId(taskId, req.user.id);
    if (!row) {
      throw new NotFoundException('Task not found');
    }

    const data = (await this._populateTags([row]))[0];

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
    let list: List | null = null;
    if (body.listId) {
      list = await listsManager.findOneByIdAndUserId(body.listId, req.user.id);
      if (!list) {
        throw new NotFoundException('List not found');
      }
    }

    const tasksMaxPerListCount = await usersManager.getUserLimit(req.user, 'tasksMaxPerListCount');

    const tasksCount = await tasksManager.countByListId(list?.id ?? null);
    if (tasksCount >= tasksMaxPerListCount) {
      throw new Error(
        `You have reached the maximum number of tasks per list (${tasksMaxPerListCount}).`
      );
    }

    if (body.parentId) {
      await tasksManager.validateParentId(null, body.parentId);
    }

    const { tagIds, ...insertData } = body;

    const maxOrderForListId = await tasksManager.findMaxOrderByListId(insertData?.listId ?? null);
    const order = maxOrderForListId + 1;

    const data = await tasksManager.insertOne({ ...insertData, order, userId: req.user.id });

    if (Array.isArray(tagIds)) {
      await tasksManager.setTags(data.id, tagIds);
    }

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
    const data = await tasksManager.findOneByIdAndUserId(taskId, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    if (body.listId) {
      const list = await listsManager.findOneByIdAndUserId(body.listId, req.user.id);
      if (!list) {
        throw new NotFoundException('List not found');
      }

      const tasksMaxPerListCount = await usersManager.getUserLimit(
        req.user,
        'tasksMaxPerListCount'
      );
      const tasksCount = await tasksManager.countByListId(list.id);
      if (tasksCount >= tasksMaxPerListCount) {
        throw new Error(
          `You have reached the maximum number of tasks for that list (${tasksMaxPerListCount}).`
        );
      }
    }

    if (body.parentId) {
      await tasksManager.validateParentId(taskId, body.parentId);
    }

    const { tagIds, ...updateData } = body;

    const updatedData = await tasksManager.updateOneById(taskId, updateData);

    if (Array.isArray(tagIds)) {
      await tasksManager.setTags(data.id, tagIds);
    }

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':taskId')
  async delete(
    @Req() req: Request,
    @Param('taskId') taskId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(taskId, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = body.isHardDelete
      ? await tasksManager.deleteOneById(taskId)
      : await tasksManager.updateOneById(taskId, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(taskId, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.updateOneById(taskId, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/duplicate')
  async duplicate(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(taskId, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.duplicate(taskId);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/complete')
  async complete(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(taskId, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.updateOneById(taskId, {
      completedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':taskId/uncomplete')
  async uncomplete(
    @Req() req: Request,
    @Param('taskId') taskId: string
  ): Promise<AbstractResponseDto<Task>> {
    const data = await tasksManager.findOneByIdAndUserId(taskId, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.updateOneById(taskId, {
      completedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }

  private async _populateTags(tasks: Task[]) {
    const taskIds = tasks.map((task) => task.id);
    const tagsMap = await tasksManager.getTagIdsForTaskIds(taskIds);

    return tasks.map((task) => {
      const tags = tagsMap[task.id] || [];
      const tagIds = tags.map((tag) => tag.id);

      return {
        ...task,
        tags,
        tagIds,
      };
    });
  }
}

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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Task } from '@myzenbuddy/database-core';
import { listsManager, tasksManager } from '@myzenbuddy/database-services';
import { SortDirectionEnum } from '@myzenbuddy/shared-common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/abstract-response.dto';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@Controller('/api/v1/tasks')
export class TasksController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Task[]>> {
    if (!req.user) {
      throw new UnauthorizedException();
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
  @Get(':id')
  async view(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Task>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

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
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const list = listsManager.findOneByIdAndUserId(body.listId, req.user.id);
    if (!list) {
      throw new NotFoundException('Task not found');
    }

    const order = (await tasksManager.findMaxOrderByListId(body.listId)) * 100;

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
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const list = listsManager.findOneByIdAndUserId(body.listId, req.user.id);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const updatedData = await tasksManager.updateOneById(id, body);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Task>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const data = await tasksManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = await tasksManager.updateOneById(id, {
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
    if (!req.user) {
      throw new UnauthorizedException();
    }

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
  @Post(':id/complete')
  async complete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Task>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

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
    if (!req.user) {
      throw new UnauthorizedException();
    }

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

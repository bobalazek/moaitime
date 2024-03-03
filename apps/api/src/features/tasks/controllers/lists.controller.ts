import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { List } from '@moaitime/database-core';
import { listsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateListDto } from '../dtos/create-list.dto';
import { UpdateListDto } from '../dtos/update-list.dto';

@Controller('/api/v1/lists')
export class ListsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<List[]>> {
    const data = await listsManager.list(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('tasks-count-map')
  async tasksCountMap(@Req() req: Request): Promise<AbstractResponseDto<Record<string, number>>> {
    const includeCompleted = req.query.includeCompleted === 'true';
    const includeDeleted = req.query.includeDeleted === 'true';

    const map = await listsManager.getTasksCountMap(req.user.id, {
      includeCompleted,
      includeDeleted,
    });

    const data: Record<string, number> = {};
    map.forEach((count, listId) => {
      data[listId ?? ''] = count;
    });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':listId')
  async view(
    @Req() req: Request,
    @Param('listId') listId: string
  ): Promise<AbstractResponseDto<List>> {
    const data = await listsManager.view(req.user.id, listId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateListDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<List>> {
    const data = await listsManager.create(req.user, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':listId')
  async update(
    @Req() req: Request,
    @Param('listId') listId: string,
    @Body() body: UpdateListDto
  ): Promise<AbstractResponseDto<List>> {
    const data = await listsManager.update(req.user.id, listId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':listId')
  async delete(
    @Req() req: Request,
    @Param('listId') listId: string
  ): Promise<AbstractResponseDto<List>> {
    const data = await listsManager.delete(req.user.id, listId);

    return {
      success: true,
      data,
    };
  }

  // Visible
  @UseGuards(AuthenticatedGuard)
  @Post(':listId/visible')
  async addVisible(
    @Req() req: Request,
    @Param('listId') listId: string
  ): Promise<AbstractResponseDto> {
    if (listId === 'unlisted') {
      listId = '';
    }

    await listsManager.addVisible(req.user.id, listId);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':listId/visible')
  async removeVisible(
    @Req() req: Request,
    @Param('listId') listId: string
  ): Promise<AbstractResponseDto> {
    if (listId === 'unlisted') {
      listId = '';
    }

    await listsManager.removeVisible(req.user.id, listId);

    return {
      success: true,
    };
  }
}

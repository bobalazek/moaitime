import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { List } from '@myzenbuddy/database-core';
import { listsManager } from '@myzenbuddy/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/abstract-response.dto';
import { CreateListDto } from '../dtos/create-list.dto';
import { UpdateListDto } from '../dtos/update-list.dto';

@Controller('/api/v1/lists')
export class ListsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<List[]>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const data = await listsManager.findManyByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async view(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<List>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const data = await listsManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('List not found');
    }

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
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const data = await listsManager.insertOne({ ...body, userId: req.user.id });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateListDto
  ): Promise<AbstractResponseDto<List>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const data = await listsManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('List not found');
    }

    const updatedData = await listsManager.updateOneById(id, body);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<List>> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const data = await listsManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('List not found');
    }

    const updatedData = await listsManager.updateOneById(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Tag } from '@moaitime/database-core';
import { tagsManager } from '@moaitime/database-services';
import { TAGS_MAX_PER_USER_COUNT } from '@moaitime/shared-backend';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { UpdateTagDto } from '../dtos/update-tag.dto';

@Controller('/api/v1/tags')
export class TagsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Tag[]>> {
    const data = await tagsManager.findManyByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async view(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Tag>> {
    const canView = await tagsManager.userCanView(id, req.user.id);
    if (!canView) {
      throw new NotFoundException('You cannot view this tag');
    }

    const data = await tagsManager.findOneByIdAndUserId(id, req.user.id);
    if (!data) {
      throw new NotFoundException('Tag not found');
    }

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Body() body: CreateTagDto, @Req() req: Request): Promise<AbstractResponseDto<Tag>> {
    const tagsCount = await tagsManager.countByUserId(req.user.id);
    if (tagsCount >= TAGS_MAX_PER_USER_COUNT) {
      throw new ForbiddenException(
        `You have reached the maximum number of tags per user (${TAGS_MAX_PER_USER_COUNT}).`
      );
    }

    const data = await tagsManager.insertOne({ ...body, userId: req.user.id });

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
    @Body() body: UpdateTagDto
  ): Promise<AbstractResponseDto<Tag>> {
    const canUpdate = await tagsManager.userCanUpdate(id, req.user.id);
    if (!canUpdate) {
      throw new NotFoundException('You cannot update this tag');
    }

    const updatedData = await tagsManager.updateOneById(id, body);

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Tag>> {
    const canDelete = await tagsManager.userCanDelete(id, req.user.id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this tag');
    }

    const updatedData = await tagsManager.updateOneById(id, {
      deletedAt: new Date(),
    });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/undelete')
  async undelete(@Req() req: Request, @Param('id') id: string): Promise<AbstractResponseDto<Tag>> {
    const canDelete = await tagsManager.userCanDelete(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this tag');
    }

    const updatedData = await tagsManager.updateOneById(id, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }
}

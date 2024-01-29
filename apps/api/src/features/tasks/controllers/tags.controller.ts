import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Tag } from '@moaitime/database-core';
import { tagsManager, usersManager } from '@moaitime/database-services';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { UpdateTagDto } from '../dtos/update-tag.dto';

@Controller('/api/v1/tags')
export class TagsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Tag[]>> {
    const includeDeleted = req.query.includeDeleted === 'true';

    const data = await tagsManager.findManyByUserId(req.user.id, {
      includeDeleted,
    });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':tagId')
  async view(
    @Req() req: Request,
    @Param('tagId') tagId: string
  ): Promise<AbstractResponseDto<Tag>> {
    const canView = await tagsManager.userCanView(tagId, req.user.id);
    if (!canView) {
      throw new NotFoundException('You cannot view this tag');
    }

    const data = await tagsManager.findOneByIdAndUserId(tagId, req.user.id);
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
    const tagsMaxPerUserCount = await usersManager.getUserLimit(req.user, 'listsMaxPerUserCount');

    const tagsCount = await tagsManager.countByUserId(req.user.id);
    if (tagsCount >= tagsMaxPerUserCount) {
      throw new ForbiddenException(
        `You have reached the maximum number of tags per user (${tagsMaxPerUserCount}).`
      );
    }

    const data = await tagsManager.insertOne({ ...body, userId: req.user.id });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':tagId')
  async update(
    @Req() req: Request,
    @Param('tagId') tagId: string,
    @Body() body: UpdateTagDto
  ): Promise<AbstractResponseDto<Tag>> {
    const canUpdate = await tagsManager.userCanUpdate(tagId, req.user.id);
    if (!canUpdate) {
      throw new NotFoundException('You cannot update this tag');
    }

    const data = await tagsManager.updateOneById(tagId, body);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':tagId')
  async delete(
    @Req() req: Request,
    @Param('tagId') tagId: string,
    @Body() body: DeleteDto
  ): Promise<AbstractResponseDto<Tag>> {
    const canDelete = await tagsManager.userCanDelete(tagId, req.user.id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this tag');
    }

    const data = body.isHardDelete
      ? await tagsManager.deleteOneById(tagId)
      : await tagsManager.updateOneById(tagId, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':tagId/undelete')
  async undelete(
    @Req() req: Request,
    @Param('tagId') tagId: string
  ): Promise<AbstractResponseDto<Tag>> {
    const canDelete = await tagsManager.userCanUpdate(req.user.id, tagId);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this tag');
    }

    const data = await tagsManager.updateOneById(tagId, {
      deletedAt: null,
    });

    return {
      success: true,
      data,
    };
  }
}

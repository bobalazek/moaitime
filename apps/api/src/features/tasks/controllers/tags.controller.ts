import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Tag } from '@moaitime/database-core';
import { tagsManager } from '@moaitime/database-services';

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

    const data = await tagsManager.list(req.user.id, includeDeleted);

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
    const data = await tagsManager.view(req.user.id, tagId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Body() body: CreateTagDto, @Req() req: Request): Promise<AbstractResponseDto<Tag>> {
    const data = await tagsManager.create(req.user, body);

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
    const data = await tagsManager.update(req.user.id, tagId, body);

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
    const data = await tagsManager.delete(req.user.id, tagId, body.isHardDelete);

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
    const data = await tagsManager.undelete(req.user.id, tagId);

    return {
      success: true,
      data,
    };
  }
}

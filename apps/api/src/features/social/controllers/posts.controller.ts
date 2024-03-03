import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Post } from '@moaitime/database-core';
import { postsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/posts')
export class PostsController {
  @UseGuards(AuthenticatedGuard)
  @Delete(':postId')
  async delete(
    @Req() req: Request,
    @Param('postId') postId: string
  ): Promise<AbstractResponseDto<Post>> {
    const data = await postsManager.delete(req.user.id, postId);

    return {
      success: true,
      data,
    };
  }
}

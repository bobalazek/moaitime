import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { FeedbackEntry } from '@moaitime/database-core';
import { feedbackEntriesManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateFeedbackEntryDto } from '../dtos/create-feedback-entry.dto';

@Controller('/api/v1/feedback-entries')
export class FeedbackEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Post()
  async list(
    @Body() body: CreateFeedbackEntryDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<FeedbackEntry>> {
    const data = await feedbackEntriesManager.create(req.user.id, body);

    return {
      success: true,
      data,
    };
  }
}

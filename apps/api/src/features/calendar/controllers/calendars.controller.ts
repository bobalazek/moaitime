import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Calendar } from '@moaitime/database-core';
import { calendarsManager, usersManager } from '@moaitime/database-services';
import {
  Calendar as ApiCalendar,
  CreateCalendar,
  UpdateUserCalendar,
  User,
} from '@moaitime/shared-common';

import { DeleteDto } from '../../../dtos/delete.dto';
import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { CreateCalendarDto } from '../dtos/create-calendar.dto';
import { UpdateCalendarDto } from '../dtos/update-calendar.dto';

@Controller('/api/v1/calendars')
export class CalendarsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const calendars = await calendarsManager.findManyByUserId(req.user.id);
    const data = await calendarsManager.convertToApiResponse(calendars, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('deleted')
  async listDeleted(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const calendars = await calendarsManager.findManyDeletedByUserId(req.user.id);
    const data = await calendarsManager.convertToApiResponse(calendars, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('shared')
  async listShared(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const calendars = await calendarsManager.findManySharedByUserId(req.user.id);
    const data = await calendarsManager.convertToApiResponse(calendars, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('public')
  async listPublic(@Req() req: Request): Promise<AbstractResponseDto<ApiCalendar[]>> {
    const calendars = await calendarsManager.findManyPublic();
    const data = await calendarsManager.convertToApiResponse(calendars, req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() body: CreateCalendarDto,
    @Req() req: Request
  ): Promise<AbstractResponseDto<Calendar>> {
    const calendarsMaxPerUserCount = await usersManager.getUserLimits(
      req.user,
      'calendarsMaxPerUserCount'
    );

    const calendarsCount = await calendarsManager.countByUserId(req.user.id);
    if (calendarsCount >= calendarsMaxPerUserCount) {
      throw new ForbiddenException(
        `You have reached the maximum number of calendars per user (${calendarsMaxPerUserCount}).`
      );
    }

    const insertData = {
      ...body,
      userId: req.user.id,
    } as CreateCalendar;

    const data = await calendarsManager.insertOne(insertData);

    await calendarsManager.addVisibleCalendarIdByUserId(req.user.id, data.id);

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
    @Body() body: UpdateCalendarDto
  ): Promise<AbstractResponseDto<Calendar>> {
    const canUpdate = await calendarsManager.userCanUpdate(req.user.id, id);
    if (!canUpdate) {
      throw new ForbiddenException('You cannot update this calendar');
    }

    const updatedData = await calendarsManager.updateOneById(id, body);

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
  ): Promise<AbstractResponseDto<Calendar>> {
    const canDelete = await calendarsManager.userCanDelete(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot delete this calendar');
    }

    const updatedData = body.isHardDelete
      ? await calendarsManager.deleteOneById(id)
      : await calendarsManager.updateOneById(id, {
          deletedAt: new Date(),
        });

    return {
      success: true,
      data: updatedData,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/undelete')
  async undelete(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<Calendar>> {
    const canDelete = await calendarsManager.userCanUpdate(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException('You cannot undelete this calendar');
    }

    const updatedData = await calendarsManager.updateOneById(id, {
      deletedAt: null,
    });

    return {
      success: true,
      data: updatedData,
    };
  }

  // Shared
  @UseGuards(AuthenticatedGuard)
  @Get(':id/shared')
  async viewShared(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanAddSharedCalendar(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot add this shared calendar');
    }

    await calendarsManager.addSharedCalendarToUser(req.user.id, id);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':id/shared')
  async addShared(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanAddSharedCalendar(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot add this shared calendar');
    }

    await calendarsManager.addSharedCalendarToUser(req.user.id, id);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id/shared')
  async removeShared(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanView(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot remove this shared calendar');
    }

    await calendarsManager.removeSharedCalendarFromUser(req.user.id, id);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id/shared')
  async updateShared(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateUserCalendar
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanUpdateSharedCalendar(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot update this shared calendar');
    }

    await calendarsManager.updateSharedCalendar(req.user.id, id, body);

    return {
      success: true,
    };
  }

  // Visible
  @UseGuards(AuthenticatedGuard)
  @Post(':id/visible')
  async addVisible(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanView(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot view this calendar');
    }

    await calendarsManager.addVisibleCalendarIdByUserId(req.user.id, id);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id/visible')
  async removeVisible(
    @Req() req: Request,
    @Param('id') id: string
  ): Promise<AbstractResponseDto<User>> {
    const canView = await calendarsManager.userCanView(req.user.id, id);
    if (!canView) {
      throw new ForbiddenException('You cannot view this calendar');
    }

    await calendarsManager.removeVisibleCalendarIdByUserId(req.user.id, id);

    return {
      success: true,
    };
  }
}

import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';

import archiver from 'archiver';
import { addSeconds } from 'date-fns';

import { List } from '@moaitime/database-core';
import { logger, Logger } from '@moaitime/logging';
import {
  AUTH_DATA_EXPORT_FILE_EXPIRATION_SECONDS,
  getEnv,
  TMP_USER_DATA_EXPORTS_DIR,
} from '@moaitime/shared-backend';
import { ProcessingStatusEnum } from '@moaitime/shared-common';
import { uploader } from '@moaitime/uploader';

import { CalendarsManager, calendarsManager } from '../calendars/CalendarsManager';
import { EventsManager, eventsManager } from '../calendars/EventsManager';
import { focusSessionsManager, FocusSessionsManager } from '../focus/FocusSessionsManager';
import { MoodEntriesManager, moodEntriesManager } from '../mood/MoodEntriesManager';
import { NotesManager, notesManager } from '../notes/NotesManager';
import { listsManager, ListsManager } from '../tasks/ListsManager';
import { TasksManager, tasksManager } from '../tasks/TasksManager';
import { userDataExportsManager, UserDataExportsManager } from './UserDataExportsManager';

export class UserDataExportProcessor {
  constructor(
    private _logger: Logger,
    private _userDataExportsManager: UserDataExportsManager,
    private _calendarsManager: CalendarsManager,
    private _eventsManager: EventsManager,
    private _listsManager: ListsManager,
    private _tasksManager: TasksManager,
    private _notesManager: NotesManager,
    private _focusSessionsManager: FocusSessionsManager,
    private _moodEntriesManager: MoodEntriesManager
  ) {}

  async processNextPending() {
    // TODO: implement retry mechanism in case of failure

    this._logger.info('Processing next pending data export ...');

    const userDataExport = await this._userDataExportsManager.findOneOldestPending();
    if (!userDataExport) {
      this._logger.debug('No pending data exports found.');

      return;
    }

    try {
      this._logger.info(
        `Found pending data export (id: ${userDataExport.userId}). Starting to process ...`
      );

      await this._userDataExportsManager.updateOneById(userDataExport.id, {
        processingStatus: ProcessingStatusEnum.PROCESSING,
        startedAt: new Date(),
      });

      const tmpUserDataExportDir = `${TMP_USER_DATA_EXPORTS_DIR}/${userDataExport.userId}`;
      if (!existsSync(tmpUserDataExportDir)) {
        this._logger.debug(`Creating tmp user data export directory (${tmpUserDataExportDir}) ...`);

        mkdirSync(tmpUserDataExportDir, { recursive: true });
      }

      // Save data
      await this._saveCalendars(userDataExport.userId, tmpUserDataExportDir);
      await this._saveEvents(userDataExport.userId, tmpUserDataExportDir);
      const lists = await this._saveLists(userDataExport.userId, tmpUserDataExportDir);
      await this._saveTasks(userDataExport.userId, tmpUserDataExportDir, lists);
      await this._saveNotes(userDataExport.userId, tmpUserDataExportDir);
      await this._saveFocusSessions(userDataExport.userId, tmpUserDataExportDir);
      await this._saveMoodEntries(userDataExport.userId, tmpUserDataExportDir);

      const completedAt = new Date();
      const expiresAt = addSeconds(completedAt, AUTH_DATA_EXPORT_FILE_EXPIRATION_SECONDS);

      const zipFile = await this._zipFolder(tmpUserDataExportDir);
      const exportUrl = await this._uploadToBucket(zipFile);

      await this._userDataExportsManager.updateOneById(userDataExport.id, {
        processingStatus: ProcessingStatusEnum.PROCESSED,
        exportUrl,
        completedAt,
        expiresAt,
      });

      this._logger.info(`Finished processing data export (id: ${userDataExport.userId})`);
    } catch (error) {
      this._logger.error(
        error,
        `Failed to process data export (id: ${userDataExport.userId}). Starting to process ...`
      );

      await this._userDataExportsManager.updateOneById(userDataExport.id, {
        processingStatus: ProcessingStatusEnum.FAILED,
        failedAt: new Date(),
        failedError: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
      });
    }
  }

  setLogger(logger: Logger) {
    this._logger = logger;
  }

  async _saveCalendars(userId: string, tmpUserDataExportDir: string) {
    this._logger.debug(`Fetching calendars for user (id: ${userId}) ...`);

    const calendars = await this._calendarsManager.findManyByUserId(userId);

    this._logger.debug(`Found ${calendars.length} calendars for user (id: ${userId}).`);

    const calendarsJson = JSON.stringify(calendars, null, 2);

    this._logger.debug(`Writing calendars for user (id: ${userId}) to file ...`);

    const calendarsFilePath = `${tmpUserDataExportDir}/calendars.json`;

    writeFileSync(calendarsFilePath, calendarsJson);
  }

  async _saveEvents(userId: string, tmpUserDataExportDir: string) {
    this._logger.debug(`Fetching events for user (id: ${userId}) ...`);

    const calendarIdsMap = await this._calendarsManager.getVisibleCalendarIdsByUserIdMap(userId);
    const events = await this._eventsManager.findManyByCalendarIdsAndRange(calendarIdsMap, userId);

    this._logger.debug(`Found ${events.length} events for user (id: ${userId}).`);

    const eventsJson = JSON.stringify(events, null, 2);

    this._logger.debug(`Writing events for user (id: ${userId}) to file ...`);

    const eventsFilePath = `${tmpUserDataExportDir}/events.json`;

    writeFileSync(eventsFilePath, eventsJson);
  }

  async _saveLists(userId: string, tmpUserDataExportDir: string) {
    this._logger.debug(`Fetching lists for user (id: ${userId}) ...`);

    const lists = await this._listsManager.findManyByUserId(userId);

    this._logger.debug(`Found ${lists.length} lists for user (id: ${userId}).`);

    const listsJson = JSON.stringify(lists, null, 2);

    this._logger.debug(`Writing lists for user (id: ${userId}) to file ...`);

    const listsFilePath = `${tmpUserDataExportDir}/lists.json`;

    writeFileSync(listsFilePath, listsJson);

    return lists;
  }

  async _saveTasks(userId: string, tmpUserDataExportDir: string, lists: List[]) {
    this._logger.debug(`Fetching tasks for user (id: ${userId}) ...`);

    // TODO: we also want to export tasks that are not assigned to a list!
    for (const list of lists) {
      const listsDir = `${tmpUserDataExportDir}/tasks`;
      if (!existsSync(listsDir)) {
        this._logger.debug(`Creating lists directory (${listsDir}) ...`);

        mkdirSync(listsDir, { recursive: true });
      }

      const listFilePath = `${listsDir}/${list.id}.json`;

      const tasks = await this._tasksManager.findManyByUserId(userId, list.id);

      this._logger.debug(`Found ${tasks.length} tasks for user (id: ${userId}).`);

      const tasksJson = JSON.stringify(tasks, null, 2);

      this._logger.debug(`Writing tasks for user (id: ${userId}) to file ...`);

      writeFileSync(listFilePath, tasksJson);
    }
  }

  async _saveNotes(userId: string, tmpUserDataExportDir: string) {
    this._logger.debug(`Fetching notes for user (id: ${userId}) ...`);

    const notes = await this._notesManager.findManyByUserId(userId);

    this._logger.debug(`Found ${notes.length} notes for user (id: ${userId}).`);

    const notesJson = JSON.stringify(notes, null, 2);

    this._logger.debug(`Writing notes for user (id: ${userId}) to file ...`);

    const notesFilePath = `${tmpUserDataExportDir}/notes.json`;

    writeFileSync(notesFilePath, notesJson);
  }

  async _saveMoodEntries(userId: string, tmpUserDataExportDir: string) {
    this._logger.debug(`Fetching mood enries for user (id: ${userId}) ...`);

    const { data: moodEntries } =
      await this._moodEntriesManager.findManyByUserIdWithDataAndMeta(userId);

    this._logger.debug(`Found ${moodEntries.length} mood entries for user (id: ${userId}).`);

    const moodEntriesJson = JSON.stringify(moodEntries, null, 2);

    this._logger.debug(`Writing mood entries for user (id: ${userId}) to file ...`);

    const moodEntriesFilePath = `${tmpUserDataExportDir}/mood-entries.json`;

    writeFileSync(moodEntriesFilePath, moodEntriesJson);
  }

  async _saveFocusSessions(userId: string, tmpUserDataExportDir: string) {
    this._logger.debug(`Fetching focus sessions for user (id: ${userId}) ...`);

    const focusSessions = await this._focusSessionsManager.findManyByUserId(userId);

    this._logger.debug(`Found ${focusSessions.length} focus sessions for user (id: ${userId}).`);

    const focusSessionsJson = JSON.stringify(focusSessions, null, 2);

    this._logger.debug(`Writing focus sessions for user (id: ${userId}) to file ...`);

    const focusSessionsFilePath = `${tmpUserDataExportDir}/focus-sessions.json`;

    writeFileSync(focusSessionsFilePath, focusSessionsJson);
  }

  async _zipFolder(tmpUserDataExportDir: string) {
    this._logger.debug(`Zipping folder (${tmpUserDataExportDir}) ...`);

    const zipFilePath = `${tmpUserDataExportDir}.zip`;

    const output = createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.pipe(output);

    archive.directory(tmpUserDataExportDir, false);

    await archive.finalize();

    return zipFilePath;
  }

  async _uploadToBucket(zipFilePath: string) {
    this._logger.debug(`Uploading file (${zipFilePath}) to bucket ...`);

    if (!existsSync(zipFilePath)) {
      throw new Error(`File (${zipFilePath}) does not exist.`);
    }

    const { USER_DATA_EXPORTS_BUCKET_URL } = getEnv();

    return uploader.uploadToBucket(
      USER_DATA_EXPORTS_BUCKET_URL,
      zipFilePath,
      'application/zip',
      zipFilePath.split('/').pop()!,
      AUTH_DATA_EXPORT_FILE_EXPIRATION_SECONDS
    );
  }
}

export const userDataExportProcessor = new UserDataExportProcessor(
  logger,
  userDataExportsManager,
  calendarsManager,
  eventsManager,
  listsManager,
  tasksManager,
  notesManager,
  focusSessionsManager,
  moodEntriesManager
);

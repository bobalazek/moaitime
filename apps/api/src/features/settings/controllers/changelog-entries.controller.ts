import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { Controller, Get } from '@nestjs/common';
import matter from 'gray-matter';

import { ChangelogEntry } from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';

@Controller('/api/v1/changelog-entries')
export class ChangelogEntriesController {
  @Get()
  async list(): Promise<AbstractResponseDto<ChangelogEntry[]>> {
    const data: ChangelogEntry[] = [];

    const changelogEntryFiles = readdirSync(join(__dirname, './changelog-entries'));
    for (const changelogEntryFile of changelogEntryFiles) {
      const fileContents = readFileSync(
        join(__dirname, './changelog-entries', changelogEntryFile),
        'utf8'
      );

      const result = matter(fileContents);

      const slug = changelogEntryFile.replace('.mdx', '');
      const title = result.data.title;
      const content = result.content;
      const date = result.data.date;

      data.push({
        slug,
        title,
        content,
        date,
      });
    }

    return {
      success: true,
      data,
    };
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../core/middlewares/app.middleware';
import { NotesController } from './controllers/notes.controller';

@Module({
  imports: [],
  controllers: [NotesController],
  providers: [],
})
export class NotesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}

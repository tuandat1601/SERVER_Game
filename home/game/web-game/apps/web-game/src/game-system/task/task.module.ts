import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { GameDataModule } from '../../game-data/gamedata.module';

@Module({
  imports:[GameDataModule],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}

import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
@Module({
  imports: [GameDataModule],
  controllers: [SkillController],
  providers: [SkillService],

})
export class SkillModule {}

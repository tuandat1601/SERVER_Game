import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './title.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
@Module({
	imports:[GameDataModule],
	controllers: [TitleController],
	providers: [TitleService]
})
export class TitleModule {}

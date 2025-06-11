import { Module } from '@nestjs/common';
import { RaremonsterService } from './raremonster.service';
import { RaremonsterController } from './raremonster.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
@Module({
	imports:[GameDataModule],
	controllers: [RaremonsterController],
	providers: [RaremonsterService]
})
export class RaremonsterModule {}

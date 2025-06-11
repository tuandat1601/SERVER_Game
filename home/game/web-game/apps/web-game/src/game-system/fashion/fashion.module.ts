import { Module } from '@nestjs/common';
import { FashionService } from './fashion.service';
import { FashionController } from './fashion.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
@Module({
	imports:[GameDataModule],
	controllers: [FashionController],
	providers: [FashionService]
})
export class FashionModule {}

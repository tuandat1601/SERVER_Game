import { Module } from '@nestjs/common';
import { CQService } from './cq.service';
import { CQController } from './cq.controller';
import { GameDataModule } from '../../game-data/gamedata.module';
@Module({
	imports:[GameDataModule],
	controllers: [CQController],
	providers: [CQService]
})
export class CQModule {}

import { ApiProperty } from '@nestjs/swagger';
import { EGameRoleStatus } from 'apps/web-game/src/config/game-enum';
import { IsInt, IsJSON, IsString } from 'class-validator';
import { ItemsRecord } from '../../../game-data/entity/item.entity';
import { RoleKeyDto } from './role-key.dto';


export class UpdateRoleDto extends RoleKeyDto {

    @ApiProperty({ description: '玩家角色名称' })
    @IsString()
    name: string;

    @ApiProperty({ description: '状态' })
    @IsString()
    status: EGameRoleStatus;
}

export class RoleInfoSubDto {

    @ApiProperty({ description: '系统1' })
    @IsInt()
    readonly system1: number
}


export class UpdateRoleItemDto extends RoleKeyDto {

    @ApiProperty({ description: '角色信息' })
    readonly info: ItemsRecord;
}

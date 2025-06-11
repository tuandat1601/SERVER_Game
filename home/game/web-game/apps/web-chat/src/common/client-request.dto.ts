import { RoleCommonEntity } from "apps/web-game/src/game-data/entity/arena.entity";
import { IsInt, IsString } from "class-validator";
import { WSEMsgType } from "./ws-enum";

export class BaseDto {
    @IsInt()
    type: WSEMsgType
}

export class ChatDto extends BaseDto {
    @IsString()
    chatMsg: string
}

export class GuildDto extends BaseDto {
    /**公会ID */
    @IsString()
    guildId: string
}
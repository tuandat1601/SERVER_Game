import { PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GameLoginDto {

    @ApiProperty({ example: 100, description: '用户账号' })
    @IsString()
    readonly username: string;

    @ApiProperty({ example: "123123", description: '后台TOKEN 开发模式不验证' })
    @IsString()
    readonly password: string;

    @ApiProperty({ example: "1", description: '服务器ID' })
    @IsInt()
    readonly serverid: number;
}

export class GameLoginAuthDto {

    @ApiProperty({ example: 100, description: '用户账号' })
    @IsString()
    readonly userid: string;

    @ApiProperty({ example: "123123", description: '后台TOKEN 开发模式不验证' })
    @IsString()
    readonly gameLoginToken: string;

    @ApiProperty({ example: "1", description: '服务器ID' })
    @IsInt()
    readonly serverid: number;

    @ApiProperty({ example: "test", description: 'EChannelType 渠道类型 客户端配置获取' })
    @IsString()
    readonly channelType: string;
}


export class NotifyLoginDto {

    @ApiProperty({ example: 100, description: '验证' })
    @IsString()
    gameLoginToken: string;

    @ApiProperty({ example: 100, description: '用户账号' })
    @IsString()
    userid: string;

    @ApiProperty({ example: "test", description: 'EChannelType 渠道类型' })
    @IsString()
    channelType: string;

    @ApiProperty({ example: "1", description: '服务器ID' })
    @IsInt()
    serverid: number;

    @ApiProperty({ description: '登录时间' })
    @IsInt()
    time1: number;

    @ApiProperty({ description: '验证时间' })
    @IsInt()
    time2: number;

}

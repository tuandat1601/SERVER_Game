import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";
import { OrderInfoEntity } from "../entities/channel.entity";

export class SDKLoginAuthDto {
    /**游戏标识 */
    @ApiProperty({ description: '游戏标识' })
    @IsString()
    readonly sku: string;

    /**渠道APP-ID*/
    @ApiProperty({ description: '渠道APP-ID 客户端配置获取' })
    @IsInt()
    readonly channelAppId: number;

    /**渠道uid*/
    @ApiProperty({ description: '渠道uid' })
    @IsString()
    readonly channelUserId: string;

    /**渠道SDK登录验证token*/
    @ApiProperty({ description: '渠道SDK登录验证token' })
    @IsString()
    readonly channelToken: string;

    //登录设备操作系统版本
    @ApiProperty({ example: "8.0.0", description: '登录设备操作系统版本' })
    @IsString()
    readonly deviceOs: string;

    //登录设备生产商
    @ApiProperty({ example: "HUAWEI", description: '登录设备生产商' })
    @IsString()
    readonly deviceVender: string;

    //登录设备ID
    @ApiProperty({ example: "587bee46-faa0-4f27-aeac-cb1a40c1123", description: '登录设备ID' })
    @IsString()
    readonly deviceId: string;

    //登录设备型号
    @ApiProperty({ example: "HUAWEI NXT-DL00", description: '登录设备型号' })
    @IsString()
    readonly deviceType: string;
}



export class ServerLoginAuthDto {
    /**游戏标识 */
    @ApiProperty({ description: '游戏标识' })
    @IsString()
    readonly sku: string;

    /**选服务器登录验证token 24小小时后超时*/
    @ApiProperty({ description: '选服务器登录验证token' })
    @IsString()
    readonly serverLoginToken: string;

    /**服务器id */
    @ApiProperty({ description: '服务器id' })
    @IsInt()
    readonly serverId: number;

    /**渠道APP-ID*/
    @ApiProperty({ description: '渠道APP-ID' })
    @IsInt()
    readonly channelAppId: number;
}

export class GetOrderDto {
    /**游戏标识 */
    @ApiProperty({ description: '游戏标识' })
    @IsString()
    readonly sku: string;

    /**服务器id */
    @ApiProperty({ description: '服务器id' })
    @IsInt()
    readonly serverId: number;

    /**渠道APP-ID*/
    @ApiProperty({ description: '渠道APP-ID' })
    @IsInt()
    readonly channelAppId: number;

    /**账号uid*/
    @ApiProperty({ description: '账号uid' })
    @IsString()
    readonly userId: string;

    /**角色ID*/
    @ApiProperty({ description: '角色ID' })
    @IsString()
    readonly roleId: string;

    /**角色昵称*/
    @ApiProperty({ description: '角色昵称' })
    @IsString()
    readonly roleName: string;

    /**商品ID */
    @ApiProperty({ description: '商品ID' })
    @IsInt()
    readonly shopId: number;

    /**商品价格 */
    @ApiProperty({ description: '商品价格' })
    //@IsInt()
    readonly price: number;

    /**扩展信息*/
    @ApiProperty({ description: '扩展信息' })
    @IsOptional()
    readonly info?: OrderInfoEntity;
}   
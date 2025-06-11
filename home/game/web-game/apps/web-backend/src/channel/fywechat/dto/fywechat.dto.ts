import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class FywechatPaymenDto {

    /**用户唯一账号 */
    @ApiProperty({ description: '用户唯一账号' })
    @IsString()
    account: string;

    /**区服ID */
    @ApiProperty({ description: '区服ID' })
    @IsString()
    server: string;

    /**角色ID */
    @ApiProperty({ description: '角色ID' })
    @IsString()
    role: string;

    /**购买数量 */
    @ApiProperty({ description: '购买数量' })
    @IsInt()
    amount: number;

    /**平台(SDK)订单号 */
    @ApiProperty({ description: '平台(SDK)订单号' })
    @IsString()
    order: string;

    /**时间戳(10位数字) */
    @ApiProperty({ description: '时间戳(10位数字)' })
    @IsString()
    time: string;

    /**按照上方参数进行签名(需要发货通知game_key) */
    @ApiProperty({ description: '按照上方参数进行签名(需要发货通知game_key)' })
    @IsString()
    sign: string;

    /**原样传递(透传)(前端传递)参数(不参与签名) */
    @ApiProperty({ description: '原样传递(透传)(前端传递)参数(不参与签名)' })
    @IsString()
    extend: string;

}
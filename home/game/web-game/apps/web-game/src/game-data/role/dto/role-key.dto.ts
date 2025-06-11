import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RoleKeyDto {

    @ApiProperty({ description: '角色ID' })
    @IsString()
    readonly id: string;

    @ApiProperty({ example: "1", description: '服务器ID' })
    @IsInt()
    readonly serverid: number;

}

export class RoleUserDto {

    @ApiProperty({ description: '账号ID' })
    @IsString()
    readonly userid: string;

    @ApiProperty({ description: '原始服务器ID' })
    @IsInt()
    readonly originServerid: number;


}
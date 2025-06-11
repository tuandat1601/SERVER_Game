import { ApiProperty } from "@nestjs/swagger";
import { EBUserStatus } from "apps/web-backend/src/backend-enum";
import { IsArray, IsOptional, IsString } from "class-validator";

/**创建后台账号 */
export class CreateUserDto {
    /**用户账号 */
    @ApiProperty({ example: "admin", description: '用户账号' })
    @IsString()
    readonly username: string;

    /**昵称 */
    @ApiProperty({ example: "管理", description: '昵称' })
    @IsString()
    readonly nickname: string;

    /**密码 */
    @ApiProperty({ example: "123456", description: '密码' })
    @IsString()
    readonly password: string;

    /**角色 */
    @ApiProperty({ example: ["admin"], description: '角色' })
    @IsArray()
    readonly roles: string[];

    /**权限 */
    @ApiProperty({ example: ["game_btn_add"], description: '权限' })
    @IsArray()
    readonly auths: string[];
}

/**保存后台账号 */
export class UpdateUserDto {
    /**用户账号 */
    @ApiProperty({ example: "admin", description: '用户账号' })
    @IsString()
    readonly username: string;

    /**昵称 */
    @ApiProperty({ example: "管理", description: '昵称' })
    @IsString()
    @IsOptional()
    readonly nickname?: string;

    /**密码 */
    @ApiProperty({ example: "123456", description: '密码' })
    @IsString()
    @IsOptional()
    readonly password?: string;

    /**角色 */
    @ApiProperty({ example: ["admin"], description: '角色' })
    @IsArray()
    @IsOptional()
    readonly roles?: string[];

    /**权限 */
    @ApiProperty({ example: ["game_btn_add"], description: '权限' })
    @IsArray()
    @IsOptional()
    readonly auths?: string[];
}

/**删除后台账号 */
export class DeleteUserDto {
    /**用户账号 */
    @ApiProperty({ example: "admin", description: '用户账号' })
    @IsString()
    readonly username: string;
}
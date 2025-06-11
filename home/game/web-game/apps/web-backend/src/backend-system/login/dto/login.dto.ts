import { ApiProperty } from "@nestjs/swagger";
import { EBUserStatus } from "apps/web-backend/src/backend-enum";
import { IsString } from "class-validator";

/**角色登录 */
export class LoginDto {
    @ApiProperty({ example: "admin", description: '用户账号' })
    @IsString()
    readonly username: string;

    @ApiProperty({ example: "123456", description: '账号密码' })
    @IsString()
    readonly password: string;
}

/**刷新Token */
export class RefreshTokenDto {
    @ApiProperty({ description: 'refreshToken' })
    @IsString()
    readonly refreshToken: string;
}
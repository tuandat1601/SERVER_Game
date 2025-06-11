import { ApiProperty } from "@nestjs/swagger";
import { EmailItemsEntity } from "apps/web-game/src/game-data/entity/email.entity";
import { IsInt, IsString } from "class-validator";

export class GetEmailDto { }

export class ReadEmailDto {
    @ApiProperty({ description: '邮件ID' })
    @IsInt()
    readonly id: number;
}

export class AutoReadEmailDto { }

export class ReceiveEmailDto {
    @ApiProperty({ description: '邮件ID' })
    @IsInt()
    readonly id: number;
}


export class AutoReceiveEmailDto {

}


export class DeleteEmailDto {
    @ApiProperty({ description: '邮件ID' })
    @IsInt()
    readonly id: number;
}


export class AutoDeleteEmailDto { }

export class SendEmailDto {

    @ApiProperty({ description: '验证KEY' })
    @IsString()
    readonly key: string;

    @ApiProperty({ description: '服务器ID' })
    @IsInt()
    readonly serverid: number;

    @ApiProperty({ description: '标题' })
    @IsString()
    readonly title: string;

    @ApiProperty({ description: '内容' })
    @IsString()
    readonly content: string;

    @ApiProperty({ description: '附件 没有发[]' })
    readonly items: EmailItemsEntity[] | any;

    @ApiProperty({ description: '发件人' })
    @IsString()
    readonly sender: string;

    @ApiProperty({ description: '收件人' })
    @IsString()
    readonly owner: string;
}

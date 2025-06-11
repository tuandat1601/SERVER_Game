import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class createDto {
  /** 名字*/
  @IsString()
  readonly name: string
  /** 旗帜*/
  @IsInt()
  readonly flag: number
  /** 宣言*/
  @IsString()
  readonly desc: string
  /** 公告*/
  @IsString()
  readonly notice: string
  /** 是否开放允许随时加入*/
  @IsInt()
  readonly open: number
  /**等级限制 */
  needlv?:number
}

export class changeDto {
  /** 名字*/
  name?: string
  /** 旗帜*/
  flag?: number
  /** 宣言*/
  desc?: string
  /** 公告*/
  notice?: string
  /** 是否开放允许随时加入*/
  open?: number
  /**等级限制 */
  needlv?:number
}

export class joinDto {
  /** 公会id*/
  gid?: string
}


export class guildDto {
  flag?:number
}
export class setLeaderDto {
  // @IsString()
  leader?:string
  /**1转让 2申请 */
  @IsInt()
  readonly type:number
}


export class listDto {
  /**申请列表索引 ，null 表示一键通过 */
  index?:number
  // @IsInt()
  // flag:number
}
import { ApiProperty } from '@nestjs/swagger';

export class RoleBaseEntity {

  @ApiProperty({ example: 6886910392582277, description: '角色账号' })
  id: string;

  @ApiProperty({ example: "游客", description: '角色昵称' })
  name: string;

}

export class RoleEntity extends RoleBaseEntity {

  name: string = "游客"
  userid: string
  serverid: number
  status: number
}
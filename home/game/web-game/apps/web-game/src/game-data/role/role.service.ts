import { Injectable } from '@nestjs/common';
import { PrismaGameDBService } from "../../game-lib/prisma/prisma.gamedb.service";
import { Role } from '@prisma/client1';

@Injectable()
export class RoleService {

  constructor(private prismaGameDB: PrismaGameDBService) { }


}

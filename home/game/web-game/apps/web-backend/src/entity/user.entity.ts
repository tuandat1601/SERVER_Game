

export class UserInfoEntity {
    /**支持的游戏ID */
    games?: string[] = [];
    /**支持的渠道ID */
}

export class UserEntity {
    username?: string
    nickname?: string
    password?: string
    roles?: string[]
    auths?: string[]
    info?: UserInfoEntity = new UserInfoEntity();
    status?: string
    createdAt?: string
}
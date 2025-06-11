export enum WSEMsgType {

    /**连接 */
    Connect = 0,

    /**发送全服聊天 */
    Send_ServerChat,

    /**发送公会聊天 */
    Send_GuildChat,

    /***服务器推送-全服群发-接受全服聊天 */
    Ret_ServerChat,

    /***服务器推送-公会群发-接受公会聊天 */
    Ret_GuildChat,

    /**服务器推送-最近聊天记录 */
    Ret_LastChatlog,

    /**客户端发送-加入公会 */
    Send_JoinGuid,

    /**客户端发送-离开公会 */
    Send_LeaveGuid,
}
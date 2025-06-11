import { ApiProperty } from "@nestjs/swagger";

/**领取主线任务奖励 */
export class GetTaskMainAwardDto {
    
    @ApiProperty({ example: 0, description: 'ETaskType 任务类型' })
    type?: number
}

/**领取每日任务奖励 */
export class GetTaskDailyAwardDto {
    /**每日任务ID */
    id: number
}

/**领取每日任务宝箱奖励 */
export class GetTaskDailyBoxAwardDto {

}


/**获取进阶任务奖励 */
export class GetTaskGradeAwardDto {
    id: number
}

/**领取任务奖励 */
export class GetTaskAwardDto {
    /**任务ID */
    id: number
}

/**领取开服福利积分奖励 */
export class GetOpenWelfareAwardDto {

}

/**领取公会活跃度奖励 */
export class GetGuildLivenessAwardDto {
    id: number;
}
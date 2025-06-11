import { IsInt } from "class-validator";

export class MercenaryActDto {
    /**激活谁*/
    @IsInt()
    type:number;
}
export class MercenaryDto {
    /**给谁赠送*/
    @IsInt()
    type:number;
    /**赠送道具id*/
    @IsInt()
    itemid:number;
    /**赠送次数*/
    @IsInt()
    count:number;
}
export class MercenarygoDto {
    /**10连*/
    count:number;
}
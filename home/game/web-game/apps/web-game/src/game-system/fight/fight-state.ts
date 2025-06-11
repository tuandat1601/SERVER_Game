import { EFightState } from "../../config/game-enum";
import { FightObjEntity } from "../../game-data/entity/fight.entity";


export function checkFightState(checekState: EFightState, actInfo: FightObjEntity) {

    if (!actInfo.state || Object.keys(actInfo.state).length <= 0) {
        return false;
    }

    if (!actInfo.state[checekState]) {
        return false;
    }

    if (actInfo.state[checekState] <= 0) {
        return false;
    }

    if (checekState === EFightState.NO_DAMAGE) {
        actInfo.state[checekState] -= 1;
    }

    return true
}
import * as UE from "ue";
import mixin from "../../../../mixin";
import {BP_BaseCharacter} from "../../BP_BaseCharacter";
import {$Nullable} from "puerts";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/AI/BTS_CheckDead.BTS_CheckDead_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTS_CheckDead extends UE.Game.Blueprints.Character.Enemy.AI.BTS_CheckDead.BTS_CheckDead_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTS_CheckDead implements BTS_CheckDead {
    Character: BP_BaseCharacter

    // 激活
    ReceiveActivationAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
        this.Character = ControlledPawn as BP_BaseCharacter
    }
    
    ReceiveSearchStartAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
        if (this.Character) {
            UE.BTFunctionLibrary.SetBlackboardValueAsBool(this, this.Dead, this.Character.Dead)
        }
    }
}
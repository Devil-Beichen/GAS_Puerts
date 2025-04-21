import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";
import {BP_BaseCharacter} from "../../BP_BaseCharacter"

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/AI/BTT_MeleeAttack.BTT_MeleeAttack_C";
// 普通攻击标签
const MeleeTag = new UE.GameplayTag("Ability.Melee")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTT_MeleeAttack extends UE.Game.Blueprints.Character.Enemy.AI.BTT_MeleeAttack.BTT_MeleeAttack_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTT_MeleeAttack implements BTT_MeleeAttack {
    ReceiveExecuteAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
        const Character = ControlledPawn as BP_BaseCharacter
        if (Character) {
            Character.ActivateAvility(MeleeTag)
            this.FinishExecute(true)
        }else
        {
            this.FinishExecute(true)
        }
    }
}
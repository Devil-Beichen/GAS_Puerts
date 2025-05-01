import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/AI/BTS_CheckBurming.BTS_CheckBurming_C";

// 着火标签
const BurmingTag = new UE.GameplayTag("Ability.FireBlast.BurmingDamage")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTS_CheckBurming extends UE.Game.Blueprints.Character.Enemy.AI.BTS_CheckBurming.BTS_CheckBurming_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTS_CheckBurming implements BTS_CheckBurming {

    ReceiveSearchStartAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
        if (UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(ControlledPawn).HasMatchingGameplayTag(BurmingTag)) {
            UE.BTFunctionLibrary.SetBlackboardValueAsBool(this, this.Burming, true)
        }else
        {
            UE.BTFunctionLibrary.SetBlackboardValueAsBool(this, this.Burming, false)
        }
    }
}
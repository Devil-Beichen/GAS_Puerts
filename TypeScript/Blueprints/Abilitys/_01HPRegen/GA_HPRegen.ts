import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_GameplayAbility} from "../BP_GameplayAbility"

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_01HPRegen/GA_HPRegen.GA_HPRegen_C";
const MA_HPRegen = UE.AnimMontage.Load("/Game/Blueprints/Character/Animations/Montage/MA_HPRegen.MA_HPRegen");
const GE_HPRegenValueClass = UE.Class.Load("/Game/Blueprints/Abilitys/_01HPRegen/GE_HPRegen_Value.GE_HPRegen_Value_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_HPRegen extends UE.Game.Blueprints.Abilitys._01HPRegen.GA_HPRegen.GA_HPRegen_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_HPRegen extends BP_GameplayAbility implements GA_HPRegen {

    K2_ActivateAbility() {
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.BP_ApplyGameplayEffectToOwner(GE_HPRegenValueClass)
        this.PlayHPRegenMontage()
    }

    // 播放技能动画
    PlayHPRegenMontage() {
        const MontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_HPRegen)
        MontageTask.OnCompleted.Add(() => this.K2_EndAbility())
        MontageTask.OnCancelled.Add(() => this.K2_EndAbility())
        MontageTask.OnBlendOut.Add(() => this.K2_EndAbility())
        MontageTask.OnInterrupted.Add(() => this.K2_EndAbility())
        MontageTask.ReadyForActivation()


    }
}
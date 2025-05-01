import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_GameplayAbility} from "../BP_GameplayAbility";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_05FireBlast/GA_05FireBlast.GA_05FireBlast_C";

const MA_FireBlast = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_FireBlast.MA_FireBlast") as UE.AnimMontage

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_05FireBlast extends UE.Game.Blueprints.Abilitys._05FireBlast.GA_05FireBlast.GA_05FireBlast_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_05FireBlast extends BP_GameplayAbility implements GA_05FireBlast {
    K2_ActivateAbility() {
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.PlayMontage()

    }

    PlayMontage() {
        const MontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_FireBlast)
        MontageTask.OnCompleted.Add(() => this.K2_EndAbility())
        MontageTask.OnCancelled.Add(() => this.K2_EndAbility())
        MontageTask.OnBlendOut.Add(() => this.K2_EndAbility())
        MontageTask.OnInterrupted.Add(() => this.K2_EndAbility())
        MontageTask.ReadyForActivation()

    }


    K2_OnEndAbility(bWasCancelled: boolean) {

    }
}
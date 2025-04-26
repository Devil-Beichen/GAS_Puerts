import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_GameplayAbility} from "../BP_GameplayAbility";
import {BP_BaseCharacter} from "../../Character/BP_BaseCharacter";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_02Dash/GA_Dash.GA_Dash_C";
// 冲刺动画蒙太奇
const MA_Dash = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Dash.MA_Dash") as UE.AnimMontage

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Dash extends UE.Game.Blueprints.Abilitys._02Dash.GA_Dash.GA_Dash_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Dash extends BP_GameplayAbility implements GA_Dash {

    Character: BP_BaseCharacter = new BP_BaseCharacter

    K2_ActivateAbility() {
        this.Character = this.GetAvatarActorFromActorInfo() as BP_BaseCharacter
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.PlayAnimMontage()
        this.DashForward()

    }

    // 播放动画
    PlayAnimMontage() {
        const MontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Dash)
        MontageTask.OnInterrupted.Add(() => this.K2_EndAbility())
        MontageTask.OnCancelled.Add(() => this.K2_EndAbility())
        MontageTask.OnBlendOut.Add(() => this.K2_EndAbility())
        MontageTask.OnCompleted.Add(() => this.K2_EndAbility())
        MontageTask.ReadyForActivation()
    }

    // 冲刺
    DashForward() {
        if (this.Character) {
            this.Character.DashForward(
                this.Character.GetActorForwardVector(),
                2000, 0.66)
        }
    }

    // 结束
    K2_OnEndAbility(bWasCancelled: boolean) {
        if (this.Character) {
            this.Character.SetFrictionToZero(false)
        }
    }
}
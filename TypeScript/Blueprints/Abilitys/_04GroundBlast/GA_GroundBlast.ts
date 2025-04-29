import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseCharacter} from "../../../Blueprints/Character/BP_BaseCharacter";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_04GroundBlast/GA_GroundBlast.GA_GroundBlast_C";

// 选择蒙太奇
const MA_Select = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_SelectGroundBlast.MA_SelectGroundBlast") as UE.AnimMontage
// 播放蒙太奇
const MA_Cast = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Cast.MA_Cast") as UE.AnimMontage

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_GroundBlast extends UE.Game.Blueprints.Abilitys._04GroundBlast.GA_GroundBlast.GA_GroundBlast_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_GroundBlast implements GA_GroundBlast {

    Character: BP_BaseCharacter;

    K2_ActivateAbility() {
        this.Character = this.GetAvatarActorFromActorInfo() as BP_BaseCharacter
        if (this.Character) {
            this.Character.IsGroundBlast = true
        }
        this.PlaySelectMontage()
    }

    // 播放选择蒙太奇
    PlaySelectMontage() {
        const SelectMontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Select)
        SelectMontageTask.ReadyForActivation()
    }

    // 播放cast蒙太奇
    PlayCastMontage() {
        const CastMontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Cast)
        CastMontageTask.OnCompleted.Add(() => this.K2_EndAbility())
        CastMontageTask.OnBlendOut.Add(() => this.K2_EndAbility())
        CastMontageTask.OnInterrupted.Add(() => this.K2_EndAbility())
        CastMontageTask.OnCancelled.Add(() => this.K2_EndAbility())
        CastMontageTask.ReadyForActivation()
    }


    K2_OnEndAbility(bWasCancelled: boolean) {
        if (this.Character) {
            this.Character.IsGroundBlast = false
        }
    }
}
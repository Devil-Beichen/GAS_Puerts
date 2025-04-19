import * as UE from "ue";
import mixin from "../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_00Melee/GA_Melee.GA_Melee_C";
// 普通攻击蒙太奇
const MA_Melee = UE.AnimMontage.Load("/Game/Blueprints/Character/Animations/Montage/MA_Melee.MA_Melee")

// 命中标签
const MeleeHitTag = new UE.GameplayTag("Ability.Melee.HitEvent")

// 伤害类
const MeleeDamageClass = UE.Class.Load("/Game/Blueprints/Abilitys/_00Melee/GE_Melee_Damage.GE_Melee_Damage_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Melee extends UE.Game.Blueprints.Abilitys._00Melee.GA_Melee.GA_Melee_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Melee implements GA_Melee {
    K2_ActivateAbility() {
        console.log("普通攻击释放")
        this.K2_CommitAbility()
        this.BindHitEvent()
        this.PlayMeleeMontage()
    }

    // 播放普通攻击蒙太奇
    private PlayMeleeMontage() {
        const StartSection = UE.KismetMathLibrary.RandomInteger(2).toString()

        let MeleeMontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(
            this,
            "",
            MA_Melee,
            1, StartSection)
        MeleeMontageTask.OnCompleted.Add(() => this.K2_EndAbility())
        MeleeMontageTask.OnInterrupted.Add(() => this.K2_EndAbility())
        MeleeMontageTask.OnBlendOut.Add(() => this.K2_EndAbility())
        MeleeMontageTask.OnCancelled.Add(() => this.K2_EndAbility())
        MeleeMontageTask.ReadyForActivation()
    }

    // 绑定命中事件
    private BindHitEvent() {
        const GameplayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, MeleeHitTag, null, false, true)
        GameplayEvent.EventReceived.Add((...arge) => this.HitEvent(...arge))
        GameplayEvent.ReadyForActivation()
    }

    // 命中事件
    private HitEvent(Payload: UE.GameplayEventData) {

        this.BP_ApplyGameplayEffectToTarget(
            UE.AbilitySystemBlueprintLibrary.AbilityTargetDataFromActor(Payload.Target),
            MeleeDamageClass,
            UE.KismetMathLibrary.RandomIntegerInRange(0,4))
    }
}
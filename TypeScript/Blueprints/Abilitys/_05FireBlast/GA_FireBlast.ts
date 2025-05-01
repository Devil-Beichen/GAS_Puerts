import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_GameplayAbility} from "../BP_GameplayAbility";
import {BP_BaseCharacter} from "../../Character/BP_BaseCharacter";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_05FireBlast/GA_FireBlast.GA_FireBlast_C";

// 动画蒙太奇
const MA_FireBlast = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_FireBlast.MA_FireBlast") as UE.AnimMontage

// 拉取标签
const PullTag = new UE.GameplayTag("Ability.FireBlast.PullEvent")
// 推出标签
const PushTag = new UE.GameplayTag("Ability.FireBlast.PushEvent")
// 火球爆炸伤害
const FireBlast_Damage = UE.Class.Load("/Game/Blueprints/Abilitys/_05FireBlast/GE_05FireBlast_Damage.GE_05FireBlast_Damage_c")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_FireBlast extends UE.Game.Blueprints.Abilitys._05FireBlast.GA_FireBlast.GA_FireBlast_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_FireBlast extends BP_GameplayAbility implements GA_FireBlast {

    TargetData: UE.GameplayAbilityTargetDataHandle

    K2_ActivateAbility() {
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.BindPull()
        this.BindPush()
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

    BindPull() {
        const WaitEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, PullTag, null, true, true)
        WaitEvent.EventReceived.Add((...args) => this.Pull(...args))
        WaitEvent.ReadyForActivation()
    }

    private Pull(Payload: UE.GameplayEventData) {
        this.SpawnTargetData()
    }

    // 数据有效执行拉取
    ValidData(Data: UE.GameplayAbilityTargetDataHandle) {
        this.TargetData = Data
        this.HitActors = UE.AbilitySystemBlueprintLibrary.GetActorsFromTargetData(Data, 0)

        // 遍历所有命中的角色，进行击晕和击退操作
        for (let i = 0; i < this.HitActors.Num(); i++) {
            const HitCharacter = this.HitActors.GetRef(i) as BP_BaseCharacter
            if (HitCharacter) {
                // 击晕角色，持续时间为3秒
                HitCharacter.Stun(2)

                // 获取角色的起始位置
                const StartLocation = HitCharacter.K2_GetActorLocation()
                const EndLocation = this.GetAvatarActorFromActorInfo().K2_GetActorLocation()

                // 计算角色与技能命中点之间的方向向量
                const Direction = new UE.Vector(
                    EndLocation.X - StartLocation.X,
                    EndLocation.Y - StartLocation.Y,
                    EndLocation.Z - StartLocation.Z
                )
                const ForwardVector = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Direction))

                // 使角色沿计算出的方向击退
                HitCharacter.DashForward(ForwardVector, 800, 0.7)
            }
        }
    }

    BindPush() {
        const WaitEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, PushTag, null, true, true)
        WaitEvent.EventReceived.Add((...args) => this.Push(...args))
        WaitEvent.ReadyForActivation()
    }

    private Push(Payload: UE.GameplayEventData) {

        this.BP_ApplyGameplayEffectToTarget(this.TargetData, FireBlast_Damage)

        // 遍历所有命中的角色，进行击晕和击退操作
        for (let i = 0; i < this.HitActors.Num(); i++) {
            const HitCharacter = this.HitActors.GetRef(i) as BP_BaseCharacter
            if (HitCharacter) {
                // 击晕角色，持续时间为3秒
                HitCharacter.Stun(2)

                // 获取角色的起始位置
                const StartLocation = HitCharacter.K2_GetActorLocation()
                const EndLocation = this.GetAvatarActorFromActorInfo().K2_GetActorLocation()

                // 计算角色与技能命中点之间的方向向量
                const Direction = new UE.Vector(
                    StartLocation.X - EndLocation.X,
                    StartLocation.Y - EndLocation.Y,
                    StartLocation.Z - EndLocation.Z
                )
                const ForwardVector = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Direction))

                // 使角色沿计算出的方向击退
                HitCharacter.DashForward(ForwardVector, 1200, 0.7)
            }
        }
    }


    K2_OnEndAbility(bWasCancelled: boolean) {

    }
}
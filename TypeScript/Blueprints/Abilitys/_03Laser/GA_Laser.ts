import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_GameplayAbility} from "../../Abilitys/BP_GameplayAbility";
import {BP_Player} from "../../Character/Player/BP_Player";
import {BP_BaseCharacter} from "../../Character/BP_BaseCharacter";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_03Laser/GA_Laser.GA_Laser_C";
// 动画
const MA_Laser = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Laser.MA_Laser") as UE.AnimMontage
// 激光Actor
const LaserActorClass = UE.Class.Load("/Game/Blueprints/Abilitys/_03Laser/BP_LaserActor.BP_LaserActor_C")
// 激光伤害
const LaserDamageClass = UE.Class.Load("/Game/Blueprints/Abilitys/_03Laser/GE_Laser_Damage.GE_Laser_Damage_C")

// 激光机消耗Tag
const LaserCostTag = new UE.GameplayTag("Ability.Laser.Cost")
// 激光机结束Tag
const LaserEndTag = new UE.GameplayTag("Ability.Laser.EndEvent")

// 激光伤害Tag
const LaserDamageTag = new UE.GameplayTag("Ability.Laser.Damage")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Laser extends UE.Game.Blueprints.Abilitys._03Laser.GA_Laser.GA_Laser_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Laser extends BP_GameplayAbility implements GA_Laser {
    Character: BP_Player;
    LaserActor: UE.Actor

    K2_ActivateAbility() {
        this.Character = this.GetAvatarActorFromActorInfo() as BP_Player
        if (this.Character) {
            this.Character.IsLasering = true
            this.Character.LookCamera(true)
        }
        this.K2_CommitAbilityCost()
        this.BindEndEvent()
        this.PlayMontage()

    }

    // 播放动画
    PlayMontage() {
        const MontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Laser)
        MontageTask.ReadyForActivation()

        setTimeout(() => {
            this.SpawnLaserActor()
        }, 0.3 * 1000)
    }

    // 监听回调
    BindEndEvent() {
        const GamePlayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, LaserEndTag, null, true, true)
        GamePlayEvent.EventReceived.Add((...args) => this.EndMontage(...args))
        GamePlayEvent.ReadyForActivation()
        this.ChackCost()
        UE.KismetSystemLibrary.K2_SetTimer(this, "ChackCost", 0.25, true)

    }

    // 生成激光
    SpawnLaserActor() {
        this.LaserActor = UE.GameplayStatics.BeginDeferredActorSpawnFromClass(this, LaserActorClass, UE.Transform.Identity)
        UE.GameplayStatics.FinishSpawningActor(this.LaserActor, UE.Transform.Identity)
        if (this.LaserActor) {
            this.SpawnSuccess()
        }
    }

    // 激光生成成功
    SpawnSuccess() {
        const GameplayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, LaserDamageTag, null, false, true)
        GameplayEvent.EventReceived.Add((...args) => this.TriggerDamage(...args))
        GameplayEvent.ReadyForActivation()

        if (this.LaserActor) {
            this.LaserActor.Instigator = this.Character
            this.LaserActor.K2_AttachToComponent(
                this.Character.LaserPoint, "",
                UE.EAttachmentRule.SnapToTarget,
                UE.EAttachmentRule.SnapToTarget,
                UE.EAttachmentRule.KeepRelative,
                false)
        }
    }

    // 触发伤害
    TriggerDamage(Payload: UE.GameplayEventData) {
        this.BP_ApplyGameplayEffectToTarget(Payload.TargetData, LaserDamageClass)

        // 获取命中的Actor
        const HitActors = UE.AbilitySystemBlueprintLibrary.GetActorsFromTargetData(Payload.TargetData, 0)
        if (HitActors.Num() != 0) {
            for (let i = 0; i < HitActors.Num(); i++) {
                const HitCharacter = HitActors.GetRef(i) as BP_BaseCharacter
                if (HitCharacter && !HitCharacter.Dead) {
                    HitCharacter.Stun(0.5)
                    const StartLocation = HitCharacter.K2_GetActorLocation()
                    const EndLocation = this.Character.K2_GetActorLocation()
                    const Direction = new UE.Vector(
                        StartLocation.X - EndLocation.X,
                        StartLocation.Y - EndLocation.Y,
                        StartLocation.Z - EndLocation.Z
                    )
                    const ForwardVector = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Direction))
                    HitCharacter.DashForward(ForwardVector,1000,0.5)
                }
            }
        }
    }

    // 检查消耗
    ChackCost() {
        if (!this.IsSatisfyCost())
            this.EndMontage(null)
    }

    // 结束动画
    EndMontage(Payload: UE.GameplayEventData) {
        this.MontageJumpToSection("End")
        this.K2_EndAbility()
    }

    K2_OnEndAbility(bWasCancelled: boolean) {
        this.K2_CommitAbilityCooldown()
        this.StartUI_CD()
        if (this.LaserActor) {
            this.LaserActor.K2_DestroyActor()
        }

        this.BP_RemoveGameplayEffectFromOwnerWithAssetTags(this.Character.GetAbilityTag(LaserCostTag))

        if (this.Character) {
            this.Character.IsLasering = false
            this.Character.LookCamera(false)
        }
    }

}
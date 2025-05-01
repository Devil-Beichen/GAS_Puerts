import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseCharacter} from "../../../Blueprints/Character/BP_BaseCharacter";
import {BP_GameplayAbility} from "../BP_GameplayAbility"

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_04GroundBlast/GA_GroundBlast.GA_GroundBlast_C";

// 选择蒙太奇
const MA_Select = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_SelectGroundBlast.MA_SelectGroundBlast") as UE.AnimMontage
// 播放蒙太奇
const MA_Cast = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Cast.MA_Cast") as UE.AnimMontage
// 伤害
const BlastDamageClass = UE.Class.Load("/Game/Blueprints/Abilitys/_04GroundBlast/GE_GroundBlast_Damage.GE_GroundBlast_Damage_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_GroundBlast extends UE.Game.Blueprints.Abilitys._04GroundBlast.GA_GroundBlast.GA_GroundBlast_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_GroundBlast extends BP_GameplayAbility implements GA_GroundBlast {

    Character: BP_BaseCharacter;
    HitLocation: UE.Vector;

    K2_ActivateAbility() {
        this.Character = this.GetAvatarActorFromActorInfo() as BP_BaseCharacter
        if (this.Character) {
            this.Character.IsGroundBlast = true
        }
        this.PlaySelectMontage()
        this.SpawnTargetData()
    }

    // 播放选择蒙太奇
    PlaySelectMontage() {
        const SelectMontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Select)
        SelectMontageTask.ReadyForActivation()
    }

    // 成功释放
    ValidData(Data: UE.GameplayAbilityTargetDataHandle) {
        this.HitLocation = UE.AbilitySystemBlueprintLibrary.GetTargetDataEndPoint(Data, 0)
        this.HitActors = UE.AbilitySystemBlueprintLibrary.GetActorsFromTargetData(Data, 1)
        this.K2_CommitAbility()
        this.StartUI_CD()
        this.PlayCastMontage()

    }

    // 取消释放
    Cancelled(Data: UE.GameplayAbilityTargetDataHandle) {
        this.K2_EndAbility()
    }

    // 播放cast蒙太奇
    PlayCastMontage() {
        const CastMontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Cast)
        CastMontageTask.OnCompleted.Add(() => this.K2_EndAbility())
        CastMontageTask.OnBlendOut.Add(() => this.K2_EndAbility())
        CastMontageTask.OnInterrupted.Add(() => this.K2_EndAbility())
        CastMontageTask.OnCancelled.Add(() => this.K2_EndAbility())
        CastMontageTask.ReadyForActivation()
        UE.GameplayStatics.SpawnEmitterAtLocation(
            this,
            this.BlastFX,
            this.HitLocation,
            UE.Rotator.ZeroRotator,
            new UE.Vector(0.5, 0.5, 0.5),
            true,
            UE.EPSCPoolMethod.ManualRelease,
            true
        )

        setTimeout(() => {
            this.SkillDamage()

        }, 0.35 * 1000)
    }

    /**
     * SkillDamage 函数用于处理技能伤害效果。
     * 该函数首先对命中的目标应用游戏效果（如伤害），然后对每个命中的角色进行击晕和击退操作。
     * 具体步骤如下：
     * 1. 使用 `BP_ApplyGameplayEffectToTarget` 函数对命中的目标应用伤害效果。
     * 2. 遍历所有命中的角色，对每个角色进行击晕和击退操作。
     *   - 击晕：调用角色的 `Stun` 方法，持续时间为3秒。
     *   - 击退：计算角色与技能命中点之间的方向向量，并调用角色的 `DashForward` 方法，使角色沿该方向击退。
     */
    SkillDamage() {
        // 对命中的目标应用游戏效果（如伤害）
        this.BP_ApplyGameplayEffectToTarget(UE.AbilitySystemBlueprintLibrary.AbilityTargetDataFromActorArray(this.HitActors, true), BlastDamageClass)

        // 遍历所有命中的角色，进行击晕和击退操作
        for (let i = 0; i < this.HitActors.Num(); i++) {
            const HitCharacter = this.HitActors.GetRef(i) as BP_BaseCharacter
            if (HitCharacter) {
                // 击晕角色，持续时间为3秒
                HitCharacter.Stun(3)

                // 获取角色的起始位置
                const StartLocation = HitCharacter.K2_GetActorLocation()

                // 计算角色与技能命中点之间的方向向量
                const Direction = new UE.Vector(
                    StartLocation.X - this.HitLocation.X,
                    StartLocation.Y - this.HitLocation.Y,
                    StartLocation.Z - this.HitLocation.Z
                )
                const ForwardVector = UE.KismetMathLibrary.GetForwardVector(UE.KismetMathLibrary.MakeRotFromX(Direction))

                // 使角色沿计算出的方向击退
                HitCharacter.DashForward(ForwardVector, 800, 1)
            }
        }
    }


    K2_OnEndAbility(bWasCancelled: boolean) {
        if (this.Character) {
            this.Character.IsGroundBlast = false
        }
    }
}
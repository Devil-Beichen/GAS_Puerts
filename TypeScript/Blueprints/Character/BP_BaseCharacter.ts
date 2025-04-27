import * as UE from "ue";
import mixin from "../../mixin";
import {$Nullable, $Ref} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/BP_BaseCharacter.BP_BaseCharacter_C";

// 被动技能类
const GA_BaseResponseClass = UE.Class.Load("/Game/Blueprints/Abilitys/BaseAbility/GA_BaseResponse.GA_BaseResponse_C")
const BaseResponseTag = new UE.GameplayTag("Ability.BaseResponse")

// 普通攻击技能
const GA_MeleeClass = UE.Class.Load("/Game/Blueprints/Abilitys/_00Melee/GA_Melee.GA_Melee_C")

// 命中标签
const MeleeHitTag = new UE.GameplayTag("Ability.Melee.HitEvent")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_BaseCharacter extends UE.Game.Blueprints.Character.BP_BaseCharacter.BP_BaseCharacter_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_BaseCharacter implements BP_BaseCharacter {

    // 动画蓝图
    ABP_Sinbi: UE.Game.Blueprints.Character.Animations.ABP_Sinbi.ABP_Sinbi_C
    // 死亡
    Dead: boolean
    // 初始化摩擦力
    InitFriction: number = 0

    // 是否正在激光中
    IsLasering: boolean;

    ReceiveBeginPlay() {
        this.ABP_Sinbi = this.Mesh.GetAnimInstance() as UE.Game.Blueprints.Character.Animations.ABP_Sinbi.ABP_Sinbi_C
        this.InitAbility()
        this.InitBind()
        this.InitFriction = this.CharacterMovement.GroundFriction
    }

    // 初始化技能
    protected InitAbility() {
        if (GA_BaseResponseClass) {
            this.AbilitySystemComponent.K2_GiveAbilityAndActivateOnce(GA_BaseResponseClass)
        }
        if (GA_MeleeClass) {
            this.AbilitySystemComponent.K2_GiveAbility(GA_MeleeClass)
        }
    }

    // 激活技能
    ActivateAvility(AbilityTay: UE.GameplayTag) {
        if (this.Dead) return
        this.AbilitySystemComponent.TryActivateAbilitiesByTag(this.GetAbilityTag(AbilityTay))
    }

    // 获取技能标签
    GetAbilityTag(AbilityTay: UE.GameplayTag): UE.GameplayTagContainer {
        return UE.BlueprintGameplayTagLibrary.MakeGameplayTagContainerFromTag(AbilityTay as UE.GameplayTag)
    }

    // 绑定
    protected InitBind() {
        this.HPChanged.Add((...args) => this.HPChangedEvend(...args))
        this.MPChanged.Add((...args) => this.MPChangedEvend(...args))
        this.SPChanged.Add((...args) => this.SPChangedEvend(...args))

        this.DamageBox.OnComponentBeginOverlap.Add((...args) => this.WeaponOverlap(...args))
    }

    // 武器重叠事件
    WeaponOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {

        if (this == OtherActor) return

        if (!this.HitActor.Contains(OtherActor)) {
            this.HitActor.Add(OtherActor)
            UE.KismetSystemLibrary.PrintString(
                this,
                `${this.GetName()}击中了-->${OtherActor.GetName()}`,
                true,
                true,
                UE.LinearColor.Red,
                5.0
            )

            const GameplayEventData = new UE.GameplayEventData
            GameplayEventData.EventTag = MeleeHitTag
            GameplayEventData.Instigator = this
            GameplayEventData.Target = OtherActor
            UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, MeleeHitTag, GameplayEventData)
        }
    }

    // 开始伤害
    OpenDamage() {
        this.HitActor.Empty()
        this.DamageBox.SetCollisionEnabled(UE.ECollisionEnabled.QueryOnly)

    }

    // 结束伤害
    EndDamage() {
        this.HitActor.Empty()
        this.DamageBox.SetCollisionEnabled(UE.ECollisionEnabled.NoCollision)
    }

    // 血量变化
    protected HPChangedEvend(Value: number) {
        if (Value <= 0 && !this.Dead) {
            this.Dead = true
            this.ABP_Sinbi.Dead = true
            this.AbilitySystemComponent.RemoveActiveEffectsWithTags(this.GetAbilityTag(BaseResponseTag))
            this.CapsuleComponent.SetCollisionEnabled(UE.ECollisionEnabled.NoCollision)

        }
        // UE.KismetSystemLibrary.PrintString(this, `我是${this.GetName()},我有${Value.toString()}滴血`, true, true, UE.LinearColor.Green)
    }

    // 蓝量变化
    protected MPChangedEvend(Value: number) {
        // UE.KismetSystemLibrary.PrintString(this, Value.toString(), true, true, UE.LinearColor.Green)
    }

    // 能量变化
    protected SPChangedEvend(Value: number) {
        // UE.KismetSystemLibrary.PrintString(this, Value.toString(), true, true, UE.LinearColor.Green)
    }

    // 冲刺
    DashForward(DashDirection: UE.Vector, Force: number /* = 1.000000 */, DashTime: number/* = 0.500000 */) {

        this.SetFrictionToZero(true)
        const Impulse = new UE.Vector(
            DashDirection.X * Force,
            DashDirection.Y * Force,
            DashDirection.Z * Force
        )
        this.CharacterMovement.AddImpulse(Impulse, true)

        setTimeout(() => {
            this.SetFrictionToZero(false)
        }, DashTime * 1000)

    }

    // 设置摩擦力为0
    SetFrictionToZero(Zero: boolean) {
        if (Zero) {
            this.CharacterMovement.GroundFriction = 0
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Pawn, UE.ECollisionResponse.ECR_Ignore)
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Camera, UE.ECollisionResponse.ECR_Ignore)
        } else {
            this.CharacterMovement.GroundFriction = this.InitFriction
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Pawn, UE.ECollisionResponse.ECR_Block)
            this.CapsuleComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Camera, UE.ECollisionResponse.ECR_Block)
        }
    }

    // 眩晕
    Stun(StunDuration: number) {

    }

}


import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseCharacter} from "../BP_BaseCharacter";
import {UMG_EnemyBar} from "./UMG/UMG_EnemyBar"
import {$Ref} from "puerts";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/BP_Enemy.BP_Enemy_C";
// 创建一个属性
const AttributeSetHP = new UE.GameplayAttribute("HP", "/Script/GAS_Puerts.BaseAttributeSet:HP", null)
const AttributeSetMaxHP = new UE.GameplayAttribute("MaxHP", "/Script/GAS_Puerts.BaseAttributeSet:MaxHP", null)
// 眩晕动画
const MA_Stun = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Stun.MA_Stun") as UE.AnimMontage

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Enemy extends UE.Game.Blueprints.Character.Enemy.BP_Enemy.BP_Enemy_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Enemy extends BP_BaseCharacter implements BP_Enemy {

    // 血条UI
    UMG_Bar: UMG_EnemyBar;
    bSuccess: $Ref<boolean>;

    // 开始
    ReceiveBeginPlay() {
        super.ReceiveBeginPlay();
        this.UMG_Bar = this.Bar.GetUserWidgetObject() as UMG_EnemyBar
        this.SetBarValue()

    }

    // tick
    ReceiveTick(DeltaSeconds: number) {
        super.ReceiveTick(DeltaSeconds);
        if (!this.Dead) {
            this.SetBarRotation()
        }

    }

    // 监听血量变化
    protected HPChangedEvend(Value: number) {
        super.HPChangedEvend(Value);
        this.SetBarValue()
        if (this.Dead) {
            if (this.Bar) {
                this.Bar.K2_DestroyComponent(this)
            }
        }
    }

    // 设置血条的值
    SetBarValue() {
        if (this.UMG_Bar) {
            this.UMG_Bar.HP = UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystemComponent, AttributeSetHP, this.bSuccess)
            this.UMG_Bar.MaxHP = UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystemComponent, AttributeSetMaxHP, this.bSuccess)
        }
    }

    // 设置血条的旋转
    SetBarRotation() {
        const CameraRotation = UE.GameplayStatics.GetPlayerCameraManager(this, 0).K2_GetActorRotation()
        const NewRotation = new UE.Rotator()
        NewRotation.Roll = CameraRotation.Roll * -1
        NewRotation.Pitch = CameraRotation.Pitch * -1
        NewRotation.Yaw = CameraRotation.Yaw + 180
        this.Bar.K2_SetWorldRotation(NewRotation, false, null, false)
    }

    // 停止控制
    protected StopController() {
        const AIController = UE.AIBlueprintHelperLibrary.GetAIController(this.GetController())
        if (AIController) {
            AIController.BrainComponent.StopLogic("StopController")
        }
    }

    // 恢复控制
    protected ResumeController() {
        const AIController = UE.AIBlueprintHelperLibrary.GetAIController(this.GetController())
        if (AIController) {
            AIController.BrainComponent.RestartLogic()
        }
    }

    // 眩晕
    Stun(StunDuration: number) {
        this.StopController()
        this.PlayAnimMontage(MA_Stun)

        setTimeout(() => {
            this.ResumeController()
        }, StunDuration * 1000)
    }
}
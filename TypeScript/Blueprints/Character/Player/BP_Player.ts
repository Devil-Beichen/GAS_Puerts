import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseCharacter} from "../BP_BaseCharacter";
import {BP_PlayerController} from "./BP_PlayerController";
import {$Nullable} from "puerts";
import {NewArray, TArray} from "ue";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/BP_Player.BP_Player_C";
// 输入映射
const IMC_Default = UE.InputMappingContext.Load("/Game/Blueprints/Input/IMC_Default.IMC_Default")

// 跳跃动作
const JumpAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_Jump.IA_Jump")
// 移动动作
const MoveAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_Move.IA_Move")
// 看动作
const LookAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_Look.IA_Look")
// 锁定动作
const LockCameraAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_LockCamera.IA_LockCamera")

// 创建一个属性
const AttributeSetHP = new UE.GameplayAttribute("HP", "/Script/GAS_Puerts.BaseAttributeSet:HP", null)
const AttributeSetMaxHP = new UE.GameplayAttribute("MaxHP", "/Script/GAS_Puerts.BaseAttributeSet:MaxHP", null)

const AttributeSetMP = new UE.GameplayAttribute("MP", "/Script/GAS_Puerts.BaseAttributeSet:MP", null)
const AttributeSetMaxMP = new UE.GameplayAttribute("MaxMP", "/Script/GAS_Puerts.BaseAttributeSet:MaxMP", null)

// 冲刺命中标签
const DashHitTag = new UE.GameplayTag("Ability.Dash.HitEvent")
// 拉取标签
const PullTag = new UE.GameplayTag("Ability.FireBlast.PullEvent")
// 推出标签
const PushTag = new UE.GameplayTag("Ability.FireBlast.PushEvent")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Player extends UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Player extends BP_BaseCharacter implements BP_Player {

    // 玩家控制器
    BP_PlayerController: BP_PlayerController;

    // 相机开始位置
    CameraStartLocation = new UE.Vector;
    // 相机结束位置
    CameraEndLocation = new UE.Vector(0, 0, 180);
    // 相机开始旋转
    CameraStartRotation = new UE.Rotator;
    // 相机结束旋转
    CameraEndRotation = new UE.Rotator(-17, 0, 0);
    // 在锁定
    InLock: boolean;

    ReceiveBeginPlay() {
        this.BP_PlayerController = UE.GameplayStatics.GetPlayerController(this, 0) as BP_PlayerController
        super.ReceiveBeginPlay();
        this.AddMappingContext()
        this.LookCameraLine.SetPlayRate(1 / 0.3);
        this.Sphere.OnComponentBeginOverlap.Add((...args) => this.SphereOnOverlap(...args))

    }

    // 添加输入映射
    AddMappingContext() {
        if (this.BP_PlayerController) {
            let EnhancedInputSubsystem = UE.SubsystemBlueprintLibrary.GetLocalPlayerSubSystemFromPlayerController(
                this.BP_PlayerController,
                UE.EnhancedInputLocalPlayerSubsystem.StaticClass()) as UE.EnhancedInputLocalPlayerSubsystem;
            if (EnhancedInputSubsystem && IMC_Default) {
                EnhancedInputSubsystem.AddMappingContext(IMC_Default, 0)
            }
            UE.GameplayStatics.GetPlayerCameraManager(this, 0).ViewPitchMin = -65;
            UE.GameplayStatics.GetPlayerCameraManager(this, 0).ViewPitchMax = 25;
        }

        this.BindKeys()
    }

    // 绑定按键
    BindKeys() {
        const InputComponent = this.GetComponentByClass(UE.EnhancedInputComponent.StaticClass()) as UE.EnhancedInputComponent
        if (InputComponent) {
            InputComponent.BindAction(JumpAction, UE.ETriggerEvent.Started, this, "Jump")
            InputComponent.BindAction(MoveAction, UE.ETriggerEvent.Triggered, this, "Move")
            InputComponent.BindAction(LookAction, UE.ETriggerEvent.Triggered, this, "Look")
            InputComponent.BindAction(LockCameraAction, UE.ETriggerEvent.Started, this, "IA_LockCamera")
        }
    }

    // 球体重叠
    SphereOnOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {
        if (OtherActor != this && !this.HitActor.Contains(OtherActor)) {
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
            GameplayEventData.EventTag = DashHitTag
            GameplayEventData.Instigator = this
            GameplayEventData.Target = OtherActor
            UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, DashHitTag, GameplayEventData)
        }

    }

    // 锁定摩擦力
    SetFrictionToZero(Zero: boolean) {
        super.SetFrictionToZero(Zero);
        this.SpringArm.bDoCollisionTest = !Zero
        this.Sphere.SetCollisionEnabled(Zero ? UE.ECollisionEnabled.QueryOnly : UE.ECollisionEnabled.NoCollision)
        this.Sphere.SetSphereRadius(Zero ? 80 : 32, true)
        this.HitActor.Empty()
    }

    // 初始化技能
    protected InitAbility() {
        // 调用父类的初始化技能方法
        super.InitAbility();
        // 遍历所有技能
        for (let i = 0; i < this.GAS.Num(); i++) {
            // 检查当前技能是否有效
            if (this.GAS.GetRef(i)) {
                // 将技能赋予角色
                this.AbilitySystemComponent.K2_GiveAbility(this.GAS.GetRef(i))
                // 初始化UI中对应的技能槽信息
                this.BP_PlayerController.MainUI.AllAbilitySlot.GetRef(i).InitInfo(this.GetAbilityInfo(this.GAS.GetRef(i), 0))
            }
        }
    }

    // 来回看
    Look(ActionValue: UE.InputActionValue) {
        const Value2D = UE.EnhancedInputLibrary.Conv_InputActionValueToAxis2D(ActionValue)
        this.AddControllerYawInput(Value2D.X)
        this.AddControllerPitchInput(Value2D.Y)
    }

    // 移动
    Move(ActionValue: UE.InputActionValue) {
        const Value2D = UE.EnhancedInputLibrary.Conv_InputActionValueToAxis2D(ActionValue)
        // 前后移动朝向
        const ForwardVector = UE.KismetMathLibrary.GetForwardVector(new UE.Rotator(0, this.GetControlRotation().Yaw, 0))
        const RightVector = UE.KismetMathLibrary.GetRightVector(new UE.Rotator(0, this.GetControlRotation().Yaw, 0))

        this.AddMovementInput(ForwardVector, Value2D.Y)
        this.AddMovementInput(RightVector, Value2D.X)

    }

    // 锁定相机
    IA_LockCamera() {
        if (this.InLock) {
            this.InLock = false
            this.LookCamera(false)
        } else {
            this.InLock = true
            this.LookCamera(true)
        }

    }

    // 锁定镜头
    LookCamera(OpenLook: boolean) {
        this.bUseControllerRotationYaw = OpenLook
        this.SpringArm.bUsePawnControlRotation = !OpenLook
        this.CharacterMovement.bOrientRotationToMovement = !OpenLook

        if (OpenLook) {
            this.CameraStartLocation = this.Camera.RelativeLocation
            this.CameraStartRotation = this.Camera.RelativeRotation
            this.LookCameraLine.PlayFromStart()

        } else {
            this.CameraStartLocation = UE.Vector.ZeroVector
            this.CameraStartRotation = UE.Rotator.ZeroRotator
            this.LookCameraLine.ReverseFromEnd()
        }
    }

    // 镜头缓动
    LookCameraLine__UpdateFunc() {
        const NewLocation = UE.KismetMathLibrary.VLerp(this.CameraStartLocation, new UE.Vector(0, 0, 180), this.LookCameraLine_Time_06CE2FB749897C2110B6F4949423121D)
        const NewRotation = UE.KismetMathLibrary.RLerp(this.CameraStartRotation, new UE.Rotator(-17, 0, 0), this.LookCameraLine_Time_06CE2FB749897C2110B6F4949423121D, true)
        this.Camera.K2_SetRelativeLocationAndRotation(NewLocation, NewRotation, false, null, false)

    }

    // 血量变化
    protected HPChangedEvend(Value: number) {
        super.HPChangedEvend(Value);

        const Pre = Value / this.GetAttributeValue(AttributeSetMaxHP)
        this.BP_PlayerController.MainUI.HPAttributeBar.SetProgress(Pre)

        if (this.Dead) {
            this.DisableInput(this.BP_PlayerController)
        }
    }

    // 魔法值变化
    protected MPChangedEvend(Value: number) {
        super.MPChangedEvend(Value);
        const Pre = Value / this.GetAttributeValue(AttributeSetMaxMP)
        this.BP_PlayerController.MainUI.MPAttributeBar.SetProgress(Pre)
    }

    // 获取属性值
    GetAttributeValue(Attribute: UE.GameplayAttribute): number {
        if (Attribute.AttributeName == "") return -1
        return UE.AbilitySystemBlueprintLibrary.GetFloatAttributeFromAbilitySystemComponent(this.AbilitySystemComponent, Attribute, null)

    }

    // 拉取
    Pull() {
        UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, PullTag, null)
    }

    // 推出
    Push() {
        UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this, PushTag, null)
    }
}
import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseCharacter} from "../BP_BaseCharacter";


// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/BP_Player.BP_Player_C";
// 输入映射
const IMC_Default = UE.InputMappingContext.Load("/Game/Blueprints/Input/IMC_Default.IMC_Default")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Player extends UE.Game.Blueprints.Character.Player.BP_Player.BP_Player_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Player extends BP_BaseCharacter implements BP_Player {

    // 相机开始位置
    CameraStartLocation = new UE.Vector;
    // 相机结束位置
    CameraEndLocation = new UE.Vector(0, 0, 180);
    // 相机开始旋转
    CameraStartRotation = new UE.Rotator;
    // 相机结束旋转
    CameraEndRotation = new UE.Rotator(-17, 0, 0);

    ReceiveBeginPlay() {
        this.BP_PlayerController = UE.GameplayStatics.GetPlayerController(this, 0) as UE.Game.Blueprints.Character.Player.BP_PlayerController.BP_PlayerController_C
        super.ReceiveBeginPlay();
        this.AddMappingContext()
        this.LookCameraLine.SetPlayRate(1 / 0.3);

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
    }

    // 来回看
    Look(ActionValue: UE.Vector2D) {
        this.AddControllerYawInput(ActionValue.X)
        this.AddControllerPitchInput(ActionValue.Y)
    }

    // 移动
    Move(ActionValue: UE.Vector2D) {
        // 前后移动朝向
        const ForwardVector = UE.KismetMathLibrary.GetForwardVector(new UE.Rotator(0, this.GetControlRotation().Yaw, 0))
        const RightVector = UE.KismetMathLibrary.GetRightVector(new UE.Rotator(0, this.GetControlRotation().Yaw, 0))

        this.AddMovementInput(ForwardVector, ActionValue.Y)
        this.AddMovementInput(RightVector, ActionValue.X)

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
}
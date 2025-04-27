import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_BaseCharacter} from "../BP_BaseCharacter";
import {UMG_MainUI} from "../Player/UMG/UMG_MainUI";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/BP_PlayerController.BP_PlayerController_C";
// 普通攻击标签
const MeleeTag = new UE.GameplayTag("Ability.Melee")
// 回血技能Tag
const HPRegenTag = new UE.GameplayTag("Ability.HPRegen")
// 冲刺标签
const DashTag = new UE.GameplayTag("Ability.Dash")
// 激光技能标签
const LaserTag = new UE.GameplayTag("Ability.Laser")
// 激光技能结束标签
const LaserEndTag = new UE.GameplayTag("Ability.Laser.EndEvent")

// 普通攻击动作
const MeleeAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_Melee.IA_Melee")
// 回血技能动作
const HPRegenAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_HPRegen.IA_HPRegen")
// 冲刺动作
const DashAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_Dash.IA_Dash")
// 激光技能动作
const LaserAction = UE.InputAction.Load("/Game/Blueprints/Input/Action/IA_Laser.IA_Laser")

// 主UI类
const MainUIClass = UE.Class.Load("/Game/Blueprints/Character/Player/UMG/UMG_MainUI.UMG_MainUI_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_PlayerController extends UE.Game.Blueprints.Character.Player.BP_PlayerController.BP_PlayerController_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_PlayerController implements BP_PlayerController {

    // 主UI
    MainUI: UMG_MainUI

    // 玩家
    BP_Player: BP_BaseCharacter;

    ReceiveBeginPlay() {
        this.BP_Player = UE.GameplayStatics.GetPlayerCharacter(this, 0) as BP_BaseCharacter

        this.MainUI = UE.WidgetBlueprintLibrary.Create(this, MainUIClass, this) as UMG_MainUI
        if (this.MainUI) {
            this.MainUI.AddToViewport()
        }

        this.BindKeys()

    }

    // 绑定按键
    BindKeys() {
        const InputComponent = this.GetComponentByClass(UE.EnhancedInputComponent.StaticClass()) as UE.EnhancedInputComponent
        if (InputComponent) {
            InputComponent.BindAction(MeleeAction, UE.ETriggerEvent.Started, this, "Melee")
            InputComponent.BindAction(HPRegenAction, UE.ETriggerEvent.Started, this, "HPRegen")
            InputComponent.BindAction(DashAction, UE.ETriggerEvent.Started, this, "Dash")
            InputComponent.BindAction(LaserAction, UE.ETriggerEvent.Started, this, "Laser")
        }
    }

    // 普通攻击
    Melee() {
        if (this.BP_Player) {
            this.BP_Player.ActivateAvility(MeleeTag)
        }

    }

    // 回血技能
    HPRegen() {
        if (this.BP_Player) {
            this.BP_Player.ActivateAvility(HPRegenTag)
        }
    }

    // 冲刺
    Dash() {
        if (this.BP_Player) {
            this.BP_Player.ActivateAvility(DashTag)
        }
    }

    // 激光技能
    Laser() {
        if (this.BP_Player) {
            if (!this.BP_Player.IsLasering) {
                this.BP_Player.ActivateAvility(LaserTag)
            } else {
                this.BP_Player.IsLasering = false
                const GameplayEventData = new UE.GameplayEventData
                GameplayEventData.EventTag = LaserEndTag
                UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this.BP_Player, LaserEndTag, GameplayEventData)
            }
        }
    }
}
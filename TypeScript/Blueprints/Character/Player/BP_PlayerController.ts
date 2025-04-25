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
    }

    // 普通攻击
    Melee() {
        if (this.BP_Player) {
            this.BP_Player.ActivateAvility(MeleeTag)
        }

    }

    HPRegen() {
        console.log("HPRegen")
        if (this.BP_Player) {
            this.BP_Player.ActivateAvility(HPRegenTag)
        }
    }
}
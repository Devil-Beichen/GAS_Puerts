import * as UE from "ue";
import mixin from "../../mixin";
import {BP_PlayerController} from "../Character/Player/BP_PlayerController";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/BP_GameplayAbility.BP_GameplayAbility_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_GameplayAbility extends UE.Game.Blueprints.Abilitys.BP_GameplayAbility.BP_GameplayAbility_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_GameplayAbility implements BP_GameplayAbility {

    PlayerController: BP_PlayerController;

    // 开始UI的CD
    StartUI_CD() {
        this.PlayerController = UE.GameplayStatics.GetPlayerController(this, 0) as BP_PlayerController;
        if (this.PlayerController) {
            const AbilitySlots = this.PlayerController.MainUI.AllAbilitySlot;

            for (let i = 0; i < AbilitySlots.Num(); i++) {

                if (this.GetClass() == AbilitySlots.GetRef(i).AbilityClass) {
                    AbilitySlots.GetRef(i).StartUI_CD();
                    break;
                }

            }
        }
    }
}
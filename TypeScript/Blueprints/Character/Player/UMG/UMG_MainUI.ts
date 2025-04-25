import * as UE from "ue";
import mixin from "../../../../mixin";
import {Game, NewArray, TArray} from "ue";
import {$ref, $Ref, $set, blueprint} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/UMG/UMG_MainUI.UMG_MainUI_C";


// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface UMG_MainUI extends UE.Game.Blueprints.Character.Player.UMG.UMG_MainUI.UMG_MainUI_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class UMG_MainUI implements UMG_MainUI {
    AllAbilitySlot: TArray<UE.Game.Blueprints.Character.Player.UMG.UMG_AbilitySlot.UMG_AbilitySlot_C>

    OnInitialized() {

        this.Init();
    }

    Init() {
        blueprint.load(UE.Game.Blueprints.Character.Player.UMG.UMG_AbilitySlot.UMG_AbilitySlot_C);
        this.AllAbilitySlot = NewArray(UE.Game.Blueprints.Character.Player.UMG.UMG_AbilitySlot.UMG_AbilitySlot_C);
        this.AllAbilitySlot.Add(this.AbilitySlot_1);
        this.AllAbilitySlot.Add(this.AbilitySlot_2);
        this.AllAbilitySlot.Add(this.AbilitySlot_3);
        this.AllAbilitySlot.Add(this.AbilitySlot_4);
        this.AllAbilitySlot.Add(this.AbilitySlot_5);
        blueprint.unload(UE.Game.Blueprints.Character.Player.UMG.UMG_AbilitySlot.UMG_AbilitySlot_C);
    }
}
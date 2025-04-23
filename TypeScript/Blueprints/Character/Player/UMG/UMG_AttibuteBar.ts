import * as UE from "ue";
import mixin from "../../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Player/UMG/UMG_AttibuteBar.UMG_AttibuteBar_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface UMG_AttibuteBar extends UE.Game.Blueprints.Character.Player.UMG.UMG_AttibuteBar.UMG_AttibuteBar_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class UMG_AttibuteBar implements UMG_AttibuteBar {
    PreConstruct(IsDesignTime: boolean) {
        this.SetColor()
    }

    // 设置颜色
    protected SetColor() {
        this.Image_Bar.GetDynamicMaterial().SetVectorParameterValue("Color", this.Color)
    }

    // 设置进度
    SetProgress(Progress: number) {
        this.Image_Bar.GetDynamicMaterial().SetScalarParameterValue("Pre", UE.KismetMathLibrary.FClamp(Progress, 0, 1))
    }
}
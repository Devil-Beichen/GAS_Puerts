import * as UE from "ue";
import mixin from "../../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/UMG/UMG_EnemyBar.UMG_EnemyBar_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface UMG_EnemyBar extends UE.Game.Blueprints.Character.Enemy.UMG.UMG_EnemyBar.UMG_EnemyBar_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class UMG_EnemyBar implements UMG_EnemyBar {
    // 血量
    HP: number
    // 最大血量
    MaxHP: number

    // 获取血条的进度
    GetBarPercent(): number {
        return UE.KismetMathLibrary.FClamp(this.HP / this.MaxHP, 0, 1)
    }

    // 设置血条的值
    Get_BarText(): string {
        return `${this.HP}/${this.MaxHP}`
    }
}
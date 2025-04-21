import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";
import {BP_BaseCharacter} from "../../BP_BaseCharacter"

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/AI/BTT_FindPlayer.BTT_FindPlayer_C";
// 玩家类
const BP_PlayerClass = UE.Class.Load("/Game/Blueprints/Character/Player/BP_Player.BP_Player_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTT_FindPlayer extends UE.Game.Blueprints.Character.Enemy.AI.BTT_FindPlayer.BTT_FindPlayer_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTT_FindPlayer implements BTT_FindPlayer {

    TempPlayer: BP_BaseCharacter

    ReceiveExecuteAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {

        if (UE.BTFunctionLibrary.GetBlackboardValueAsActor(this, this.Player)) {
            this.TempPlayer = UE.BTFunctionLibrary.GetBlackboardValueAsActor(this, this.Player) as BP_BaseCharacter
            this.ChackCharacter()
        } else {
            this.TempPlayer = UE.GameplayStatics.GetActorOfClass(this,BP_PlayerClass) as BP_BaseCharacter
            this.ChackCharacter()
        }
    }

    // 检查角色
    ChackCharacter() {
        if (this.TempPlayer && !this.TempPlayer.Dead) {
            UE.BTFunctionLibrary.SetBlackboardValueAsObject(this, this.Player, this.TempPlayer)
            this.FinishExecute(true)
        } else {
            UE.BTFunctionLibrary.SetBlackboardValueAsObject(this, this.Player, null)
            this.FinishExecute(false)
        }
    }

}
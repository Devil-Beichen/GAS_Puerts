import * as UE from "ue";
import mixin from "../../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/AI/BTT_FindRemoveBurming.BTT_FindRemoveBurming_C";

const RemoveBuffClass = UE.Class.Load("/Game/Blueprints/Abilitys/_05FireBlast/BP_RemoveBurming.BP_RemoveBurming_C")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BTT_FindRemoveBurming extends UE.Game.Blueprints.Character.Enemy.AI.BTT_FindRemoveBurming.BTT_FindRemoveBurming_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BTT_FindRemoveBurming implements BTT_FindRemoveBurming {

    ReceiveExecuteAI(OwnerController: $Nullable<UE.AIController>, ControlledPawn: $Nullable<UE.Pawn>) {
        const BurmingActor = UE.GameplayStatics.GetActorOfClass(this, RemoveBuffClass)
        if (BurmingActor) {
            UE.BTFunctionLibrary.SetBlackboardValueAsVector(this, this.Location, BurmingActor.K2_GetActorLocation())
            this.FinishExecute(true)
        } else {
            this.FinishExecute(false)
        }
    }
}
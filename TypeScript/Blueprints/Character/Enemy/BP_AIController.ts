import * as UE from "ue";
import mixin from "../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Character/Enemy/BP_AIController.BP_AIController_C";

const BT_Tree = UE.BehaviorTree.Load("/Game/Blueprints/Character/Enemy/AI/BT_Tree.BT_Tree")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_AIController extends UE.Game.Blueprints.Character.Enemy.BP_AIController.BP_AIController_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_AIController implements BP_AIController {
    ReceiveBeginPlay() {
        this.RunBehaviorTree(BT_Tree)
    }
}
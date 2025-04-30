import * as UE from "ue";
import mixin from "../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_04GroundBlast/BP_GroundSelectTargetActor.BP_GroundSelectTargetActor_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_GroundSelectTargetActor extends UE.Game.Blueprints.Abilitys._04GroundBlast.BP_GroundSelectTargetActor.BP_GroundSelectTargetActor_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_GroundSelectTargetActor implements BP_GroundSelectTargetActor {

    ReceiveBeginPlay() {
        this.SetDecalSize()
    }

    ReceiveTick(DeltaSeconds: number) {

        this.Decal.K2_SetWorldLocation(this.GetPlayerLookAtPoint(), false, null, false)

    }

    // 设置贴花大小
    SetDecalSize() {
        this.Decal.DecalSize = new UE.Vector(50, this.SelectRadius, this.SelectRadius)
    }
}
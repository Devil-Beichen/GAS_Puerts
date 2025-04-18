import * as UE from "ue";
import mixin from "../../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/BaseAbility/GA_BaseResponse.GA_BaseResponse_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_BaseResponse extends UE.Game.Blueprints.Abilitys.BaseAbility.GA_BaseResponse.GA_BaseResponse_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_BaseResponse implements GA_BaseResponse {
    K2_ActivateAbility() {
        this.K2_CommitAbilityCost()
    }
}
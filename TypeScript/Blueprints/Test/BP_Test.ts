import * as UE from "ue";
import mixin from "../../mixin";

// 资产路径
const AssetPath = "/Game/Blueprints/Test/BP_Test.BP_Test_C";

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_Test extends UE.Game.Blueprints.Test.BP_Test.BP_Test_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_Test implements BP_Test {

    Fun1() {
        UE.KismetSystemLibrary.PrintString(
            this,
            "我是函数1",
            true,
            true,
            UE.LinearColor.Red,
            2
        )
        
        this.Fun2()
    }

    Fun2() {
        UE.KismetSystemLibrary.PrintString(
            this,
            "我是函数2",
            true,
            true,
            UE.LinearColor.Green,
            2
        )
    }
    
    Fun3()
    {
        UE.KismetSystemLibrary.PrintString(
            this,
            "我是函数3，我是通过蓝图调用的",
            true,
            true,
            UE.LinearColor.Blue,
            2
        )
    }
}
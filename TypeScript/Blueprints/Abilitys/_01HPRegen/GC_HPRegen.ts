import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";


// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_01HPRegen/GC_HPRegen.GC_HPRegen_C";
const HPRegenFX = UE.ParticleSystem.Load("/Game/Assets/Abilities/HealthRegen/P_HealthRegen.P_HealthRegen")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GC_HPRegen extends UE.Game.Blueprints.Abilitys._01HPRegen.GC_HPRegen.GC_HPRegen_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GC_HPRegen implements GC_HPRegen {
    WhileActive(MyTarget: $Nullable<UE.Actor>, Parameters: UE.GameplayCueParameters): boolean {

        if (HPRegenFX) {
            UE.GameplayStatics.SpawnEmitterAtLocation(
                this,
                HPRegenFX,
                MyTarget.K2_GetActorLocation(),
                MyTarget.K2_GetActorRotation(),
                MyTarget.GetActorScale3D(),
                true,
                UE.EPSCPoolMethod.ManualRelease,
                true
            )
        }


        return true;
    }
}
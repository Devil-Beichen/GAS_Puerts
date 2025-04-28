import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_03Laser/BP_LaserActor.BP_LaserActor_C";

// 激光伤害标签
const LaserDamageTag = new UE.GameplayTag("Ability.Laser.Damage")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_LaserActor extends UE.Game.Blueprints.Abilitys._03Laser.BP_LaserActor.BP_LaserActor_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_LaserActor implements BP_LaserActor {

   

    ReceiveBeginPlay() {
        this.HitActor.Empty()
        this.EndPoint.OnComponentBeginOverlap.Add((...args) => this.EndPointOnBeginOverlap(...args))
        this.EndPoint.OnComponentEndOverlap.Add((...args) => this.EndPointOnEndOverlap(...args))

        UE.KismetSystemLibrary.K2_SetTimer(this, "LaserDamage", 0.25, true)
    }

    // 重叠事件
    EndPointOnBeginOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {
        if (OtherActor != this.GetInstigator() && !this.HitActor.Contains(OtherActor)) {
            this.HitActor.Add(OtherActor)
        }
    }

    // 离开重叠事件
    EndPointOnEndOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number) {
        if (this.HitActor.Contains(OtherActor)) {
            this.HitActor.RemoveAt(this.HitActor.FindIndex(OtherActor))
        }
    }

    // 激光伤害
    LaserDamage() {
        if (this.HitActor.Num() != 0) {
            this.GameplayEventData.EventTag = LaserDamageTag
            this.GameplayEventData.Instigator = this.GetInstigator()
            this.GameplayEventData.TargetData = UE.AbilitySystemBlueprintLibrary.AbilityTargetDataFromActorArray(this.HitActor, true)
            UE.AbilitySystemBlueprintLibrary.SendGameplayEventToActor(this.GetInstigator(), LaserDamageTag, this.GameplayEventData)
        }

    }
}
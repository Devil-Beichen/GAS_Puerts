import * as UE from "ue";
import mixin from "../../../mixin";
import {$Nullable} from "puerts";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_05FireBlast/BP_RemoveBurming.BP_RemoveBurming_C";
// 着火标签
const BurmingTag = new UE.GameplayTag("Ability.FireBlast.BurmingDamage")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface BP_RemoveBurming extends UE.Game.Blueprints.Abilitys._05FireBlast.BP_RemoveBurming.BP_RemoveBurming_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class BP_RemoveBurming implements BP_RemoveBurming {

    ReceiveBeginPlay() {
        this.Box.OnComponentBeginOverlap.Add((...args) => this.BoxBeginOverlap(...args))
    }

    BoxBeginOverlap(OverlappedComponent: $Nullable<UE.PrimitiveComponent>, OtherActor: $Nullable<UE.Actor>, OtherComp: $Nullable<UE.PrimitiveComponent>, OtherBodyIndex: number, bFromSweep: boolean, SweepResult: UE.HitResult) {
        if (UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(OtherActor).HasMatchingGameplayTag(BurmingTag))
        {
            UE.AbilitySystemBlueprintLibrary.GetAbilitySystemComponent(OtherActor).RemoveActiveEffectsWithTags(UE.BlueprintGameplayTagLibrary.MakeGameplayTagContainerFromTag(BurmingTag as UE.GameplayTag))
        }
    }
}
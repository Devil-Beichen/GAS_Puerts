import * as UE from "ue";
import mixin from "../../../mixin";
import {BP_GameplayAbility} from "../../Abilitys/BP_GameplayAbility";
import {BP_Player} from "../../Character/Player/BP_Player";

// 资产路径
const AssetPath = "/Game/Blueprints/Abilitys/_03Laser/GA_Laser.GA_Laser_C";
// 动画
const MA_Laser = UE.Object.Load("/Game/Blueprints/Character/Animations/Montage/MA_Laser.MA_Laser") as UE.AnimMontage

// 激光机消耗Tag
const LaserCostTag = new UE.GameplayTag("Ability.Laser.Cost")
// 激光机结束Tag
const LaserEndTag = new UE.GameplayTag("Ability.Laser.EndEvent")

// 创建一个继承ts类（或者其他类）的接口（用来类型提示）
export interface GA_Laser extends UE.Game.Blueprints.Abilitys._03Laser.GA_Laser.GA_Laser_C {
}

// 创建一个继承ts的本体类    implements   实现类型提示
@mixin(AssetPath)
export class GA_Laser extends BP_GameplayAbility implements GA_Laser {
    Character: BP_Player;

    K2_ActivateAbility() {
        this.Character = this.GetAvatarActorFromActorInfo() as BP_Player
        if (this.Character) {
            this.Character.IsLasering = true
            this.Character.LookCamera(true)
        }
        this.K2_CommitAbilityCost()
        this.BindEndEvent()
        this.PlayMontage()

    }

    // 播放动画
    PlayMontage() {
        const MontageTask = UE.AbilityTask_PlayMontageAndWait.CreatePlayMontageAndWaitProxy(this, "", MA_Laser)
        MontageTask.ReadyForActivation()
    }

    // 监听回调
    BindEndEvent() {
        const GamePlayEvent = UE.AbilityTask_WaitGameplayEvent.WaitGameplayEvent(this, LaserEndTag, null, true, true)
        GamePlayEvent.EventReceived.Add((...args) => this.EndMontage(...args))
        GamePlayEvent.ReadyForActivation()
        this.ChackCost()
        UE.KismetSystemLibrary.K2_SetTimer(this, "ChackCost", 0.25, true)

    }

    // 检查消耗
    ChackCost() {

        if (!this.IsSatisfyCost()) {
            console.error("不够消耗")
            this.EndMontage(null)
        } else {
            console.log("足够消耗")
        }
    }

    // 结束动画
    EndMontage(Payload
               :
               UE.GameplayEventData
    ) {
        this.MontageJumpToSection("End")
        this.K2_EndAbility()
    }

    K2_OnEndAbility(bWasCancelled: boolean) {
        this.K2_CommitAbilityCooldown()
        this.StartUI_CD()

        this.BP_RemoveGameplayEffectFromOwnerWithAssetTags(this.Character.GetAbilityTag(LaserCostTag))

        if (this.Character) {
            this.Character.IsLasering = false
            this.Character.LookCamera(false)
        }
    }

}
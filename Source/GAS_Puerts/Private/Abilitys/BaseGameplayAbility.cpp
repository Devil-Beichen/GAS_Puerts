// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/BaseGameplayAbility.h"

#include "AbilitySystemBlueprintLibrary.h"
#include "AbilitySystemComponent.h"
#include "Abilitys/BaseAttributeSet.h"

// 获取技能的信息
FGameplayAbilityInfo UBaseGameplayAbility::GetAbilityInfo(const int Level) const
{
	// 获取冷却和消耗的GameplayEffect
	const UGameplayEffect* CDEffect = GetCooldownGameplayEffect();
	const UGameplayEffect* CostEffect = GetCostGameplayEffect();

	// 技能的消耗类型
	ECostType CostType = ECT_HP;

	if (CDEffect && CostEffect)
	{
		// 获取技能的CD
		float CDValue = 0.f;

		CDEffect->DurationMagnitude.GetStaticMagnitudeIfPossible(Level, CDValue);

		if (CostEffect->Modifiers.Num() > 0)
		{
			// 获取技能的消耗
			float CostValue = 0.f;
			FGameplayModifierInfo CostEffectModifierInfo = CostEffect->Modifiers[0];
			CostEffectModifierInfo.ModifierMagnitude.GetStaticMagnitudeIfPossible(Level, CostValue);
			const FString CostTypeName = CostEffectModifierInfo.Attribute.AttributeName;

			if (CostTypeName == "HP")
			{
				CostType = ECT_HP;
			}
			else if (CostTypeName == "MP")
			{
				CostType = ECT_MP;
			}
			else if (CostTypeName == "SP")
			{
				CostType = ECT_SP;
			}

			return FGameplayAbilityInfo(GetClass(), IconMaterial, CDValue, CostType, CostValue);
		}

		return FGameplayAbilityInfo(GetClass(), IconMaterial, CDValue, CostType, 0.f);
	}

	return FGameplayAbilityInfo();
}

// 判断技能消耗是否满足
bool UBaseGameplayAbility::IsSatisfyCost() const
{
	if (UAbilitySystemComponent* AbilitySystemComponent = UAbilitySystemBlueprintLibrary::GetAbilitySystemComponent(GetOwningActorFromActorInfo()))
	{
		// 游戏技能信息
		const FGameplayAbilityInfo AbilityInfo = GetAbilityInfo(0);

		float Value = 0.f;
		bool bResult = false;

		switch (AbilityInfo.CostType)
		{
		case ECT_HP:
			Value = UAbilitySystemBlueprintLibrary::GetFloatAttributeFromAbilitySystemComponent(AbilitySystemComponent, UBaseAttributeSet::GetHPAttribute(), bResult);
			break;
		case ECT_MP:
			Value = UAbilitySystemBlueprintLibrary::GetFloatAttributeFromAbilitySystemComponent(AbilitySystemComponent, UBaseAttributeSet::GetMPAttribute(), bResult);
			break;
		case ECT_SP:
			Value = UAbilitySystemBlueprintLibrary::GetFloatAttributeFromAbilitySystemComponent(AbilitySystemComponent, UBaseAttributeSet::GetSPAttribute(), bResult);
			break;
		default:
			break;
		}

		if (bResult && Value > AbilityInfo.CostValue)
		{
			return true;
		}
	}

	return false;
}

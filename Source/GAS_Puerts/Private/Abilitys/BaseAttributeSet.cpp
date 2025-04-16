// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/BaseAttributeSet.h"


#include "GameplayEffectExtension.h"

void UBaseAttributeSet::PostGameplayEffectExecute(const struct FGameplayEffectModCallbackData& Data)
{
	Super::PostGameplayEffectExecute(Data);

	if (Data.EvaluatedData.Attribute.GetUProperty() != nullptr)
	{
		// 属性名
		FString AttributeName = Data.EvaluatedData.Attribute.GetUProperty()->GetName();
		// 血量限制
		if (AttributeName == "HP")
		{
			SetHP(FMath::Clamp(GetHP(), 0.f, GetMaxHP()));
		}
		// 蓝量限制
		if (AttributeName == "MP")
		{
			SetMP(FMath::Clamp(GetMP(), 0.f, GetMaxMP()));
		}
		// 能量限制
		if (AttributeName == "SP")
		{
			SetSP(FMath::Clamp(GetSP(), 0.f, GetMaxSP()));
		}
	}
}

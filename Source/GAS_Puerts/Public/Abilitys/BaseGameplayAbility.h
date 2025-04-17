// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Abilities/GameplayAbility.h"
#include "BaseGameplayAbility.generated.h"

class UMaterialInstance;

// 技能消耗类型
UENUM(BlueprintType)
enum ECostType:uint8
{
	// 血量
	ECT_HP UMETA(DisplayerName = "HP"),
	// 蓝量
	ECT_MP UMETA(DisplayerName = "MP"),
	// 能量
	ECT_SP UMETA(DisplayerName = "SP"),
};

// 游戏技能信息
USTRUCT(BlueprintType)
struct FGameplayAbilityInfo
{
	GENERATED_BODY()

public:
	// 技能类
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="AbilityInfo")
	TSubclassOf<class UBaseGameplayAbility> AbilityClass;

	// 技能图标
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="AbilityInfo")
	UMaterialInstance* IconMaterial;

	// 技能CD
	UPROPERTY(VisibleDefaultsOnly, BlueprintReadOnly, Category="AbilityInfo")
	float CD;

	// 技能消耗类型
	UPROPERTY(VisibleDefaultsOnly, BlueprintReadOnly, Category="AbilityInfo")
	TEnumAsByte<ECostType> CostType;

	// 技能消耗值
	UPROPERTY(VisibleDefaultsOnly, BlueprintReadOnly, Category="AbilityInfo")
	float CostValue;

	// 无参构造
	FGameplayAbilityInfo()
	{
		AbilityClass = nullptr;
		IconMaterial = nullptr;
		CD = 0.f;
		CostType = ECostType::ECT_HP;
		CostValue = 0.f;
	}

	/**	有参数构造
	 * 
	 * @param AbilityClass		技能类
	 * @param IconMaterial		技能图标
	 * @param CD				技能CD
	 * @param CostType			技能消耗类型
	 * @param CostValue			技能消耗值
	 */
	FGameplayAbilityInfo(TSubclassOf<UBaseGameplayAbility> AbilityClass, UMaterialInstance* IconMaterial, float CD, TEnumAsByte<ECostType> CostType, float CostValue)
	{
		this->AbilityClass = AbilityClass;
		this->IconMaterial = IconMaterial;
		this->CD = CD;
		this->CostType = CostType;
		this->CostValue = CostValue;
	}
};

/**
 * 游戏技能基类
 */
UCLASS()
class GAS_PUERTS_API UBaseGameplayAbility : public UGameplayAbility
{
	GENERATED_BODY()

public:
	// 技能图标
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="AbilityInfo")
	UMaterialInstance* IconMaterial;

	// 获取技能信息
	UFUNCTION(BlueprintCallable, Category="AbilityInfo")
	FGameplayAbilityInfo GetAbilityInfo(const int Level = 0) const;

	// 判断技能消耗是否满足
	UFUNCTION(BlueprintPure, Category="AbilityInfo")
	bool IsSatisfyCost() const;
};

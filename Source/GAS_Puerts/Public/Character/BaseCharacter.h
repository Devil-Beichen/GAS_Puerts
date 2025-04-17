// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "BaseCharacter.generated.h"

class UBaseGameplayAbility;
struct FGameplayAbilityInfo;
struct FOnAttributeChangeData;
class UAbilitySystemComponent;

// 监听属性变化的代理
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnAttributeChanged, float, Value);

/**
 * 基础角色
 */
UCLASS()
class GAS_PUERTS_API ABaseCharacter : public ACharacter
{
	GENERATED_BODY()

public:
	ABaseCharacter();

protected:
	virtual void BeginPlay() override;

	// 技能系统组件
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="AbilitySystem")
	TObjectPtr<UAbilitySystemComponent> AbilitySystemComponent;

	// 监听血量变化
	UPROPERTY(BlueprintAssignable, Category="AbbilitySystem")
	FOnAttributeChanged HPChanged;
	void OnHPAttributeChanged(const FOnAttributeChangeData& Data);

	// 监听蓝量变化
	UPROPERTY(BlueprintAssignable, Category="AbbilitySystem")
	FOnAttributeChanged MPChanged;
	void OnMPAttributeChanged(const FOnAttributeChangeData& Data);

	// 监听能量变化
	UPROPERTY(BlueprintAssignable, Category="AbbilitySystem")
	FOnAttributeChanged SPChanged;
	void OnSPAttributeChanged(const FOnAttributeChangeData& Data);

	// 获取技能信息
	UFUNCTION(BlueprintPure, Category="AbilitySystem")
	FGameplayAbilityInfo GetAbilityInfo(const TSubclassOf<UBaseGameplayAbility> AbilityClass, const int Lecel = 0) const;

public:
	virtual void Tick(float DeltaTime) override;

	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;
};

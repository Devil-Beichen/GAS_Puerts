// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "BaseCharacter.generated.h"

class UAbilitySystemComponent;
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
	UPROPERTY(EditDefaultsOnly, Category="AbilitySystem")
	TObjectPtr<UAbilitySystemComponent> AbilitySystemComponent;

public:
	virtual void Tick(float DeltaTime) override;

	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;
};

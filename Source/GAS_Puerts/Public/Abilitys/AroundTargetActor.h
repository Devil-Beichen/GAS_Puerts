// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Abilities/GameplayAbilityTargetActor.h"
#include "AroundTargetActor.generated.h"

/**
 * 选择周围目标
 */
UCLASS()
class GAS_PUERTS_API AAroundTargetActor : public AGameplayAbilityTargetActor
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AAroundTargetActor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// 启用目标选择
	virtual void StartTargeting(UGameplayAbility* Ability) override;

	// 确认目标选择并发射数据
	virtual void ConfirmTargetingAndContinue() override;

	// 周围半径
	UPROPERTY(EditAnywhere, BlueprintReadWrite, meta=(ExposeOnSpawn= true), Category="Around")
	float AroundRadius = 10.f;
};

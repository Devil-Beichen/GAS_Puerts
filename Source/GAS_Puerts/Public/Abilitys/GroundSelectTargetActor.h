// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Abilities/GameplayAbilityTargetActor.h"
#include "GroundSelectTargetActor.generated.h"

/**
 * 地面选择目标Actor
 */
UCLASS()
class GAS_PUERTS_API AGroundSelectTargetActor : public AGameplayAbilityTargetActor
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AGroundSelectTargetActor();

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

	// 获取玩家当前朝向的点
	UFUNCTION(BlueprintPure)
	FVector GetPlayerLookAtPoint();

	// 检测半径
	UPROPERTY(EditAnywhere, BlueprintReadWrite, meta=(ExposeOnSpawn = true), Category="GroundSelect")
	float SelectRadius = 10.f;
};

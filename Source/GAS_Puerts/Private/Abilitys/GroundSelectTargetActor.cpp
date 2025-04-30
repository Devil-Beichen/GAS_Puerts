// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/GroundSelectTargetActor.h"

#include "Abilities/GameplayAbility.h"


// Sets default values
AGroundSelectTargetActor::AGroundSelectTargetActor()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AGroundSelectTargetActor::BeginPlay()
{
	Super::BeginPlay();
}

// Called every frame
void AGroundSelectTargetActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void AGroundSelectTargetActor::StartTargeting(UGameplayAbility* Ability)
{
	Super::StartTargeting(Ability);
	PrimaryPC = Cast<APlayerController>(Ability->GetOwningActorFromActorInfo()->GetInstigatorController());
}

void AGroundSelectTargetActor::ConfirmTargetingAndContinue()
{
	FVector LookPoint = GetPlayerLookAtPoint();

	if (LookPoint.Size() != 0)
	{
		// 重叠检测结果
		TArray<FOverlapResult> OverlapResults;
		// 用户弱指针储存重叠的Actor
		TArray<TWeakObjectPtr<AActor>> OverlapActors;

		FCollisionQueryParams CollisionParams;
		CollisionParams.AddIgnoredActor(PrimaryPC->GetPawn());

		// 在看到的点进行球形检测
		bool IsHit = GetWorld()->OverlapMultiByChannel(
			OverlapResults,
			LookPoint,
			FQuat::Identity,
			ECC_Pawn,
			FCollisionShape::MakeSphere(SelectRadius),
			CollisionParams
		);

		// 创建一个数据句柄，用来封装目标信息
		FGameplayAbilityTargetDataHandle TargetDataHandle;
		// 创建一个目标位置信息，并且将他加入到目标数据句柄中
		FGameplayAbilityTargetData_LocationInfo* CenterLocation = new FGameplayAbilityTargetData_LocationInfo();
		CenterLocation->TargetLocation.LiteralTransform = FTransform(LookPoint);
		CenterLocation->TargetLocation.LocationType = EGameplayAbilityTargetingLocationType::LiteralTransform;
		TargetDataHandle.Add(CenterLocation); // 0

		// 创建Actor数组数据
		FGameplayAbilityTargetData_ActorArray* ActorArray = new FGameplayAbilityTargetData_ActorArray();

		if (IsHit)
		{
			// 遍历所有重叠结果，检查是否为Pawn类型且未在OverlapActors列表中
			for (int i = 0; i < OverlapResults.Num(); i++)
			{
				APawn* HitPawn = Cast<APawn>(OverlapResults[i].GetActor());
				if (HitPawn && !OverlapActors.Contains(HitPawn))
				{
					// 将符合条件的Pawn添加到OverlapActors列表中
					OverlapActors.AddUnique(HitPawn);
				}
			}

			// 如果OverlapActors列表不为空，将其设置到ActorArray中，并添加到目标数据句柄
			if (!OverlapActors.IsEmpty())
			{
				ActorArray->SetActors(OverlapActors);
				TargetDataHandle.Add(ActorArray); // 将ActorArray添加到目标数据句柄中
			}
		}

		// 检测并且应用目标数据
		check(ShouldProduceTargetData())

		if (IsConfirmTargetingAllowed())
		{
			TargetDataReadyDelegate.Broadcast(TargetDataHandle);
		}
	}
	return;
}

FVector AGroundSelectTargetActor::GetPlayerLookAtPoint()
{
	FVector ViewLocation; // 玩家视口位置
	FRotator ViewRotation; // 玩家视口旋转

	PrimaryPC->GetPlayerViewPoint(ViewLocation, ViewRotation);

	FHitResult HitResult;
	FCollisionQueryParams CollisionParams;
	CollisionParams.AddIgnoredActor(PrimaryPC->GetPawn());

	GetWorld()->LineTraceSingleByChannel(
		HitResult,
		ViewLocation,
		ViewLocation + ViewRotation.Vector() * 5000.f,
		ECC_Visibility,
		CollisionParams
	);

	if (HitResult.bBlockingHit)
	{
		return HitResult.ImpactPoint;
	}

	return FVector::Zero();
}

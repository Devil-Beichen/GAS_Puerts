// Fill out your copyright notice in the Description page of Project Settings.


#include "Abilitys/AroundTargetActor.h"

#include "Abilities/GameplayAbility.h"


// Sets default values
AAroundTargetActor::AAroundTargetActor()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AAroundTargetActor::BeginPlay()
{
	Super::BeginPlay();
}

// Called every frame
void AAroundTargetActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void AAroundTargetActor::StartTargeting(UGameplayAbility* Ability)
{
	Super::StartTargeting(Ability);
	PrimaryPC = Cast<APlayerController>(Ability->GetOwningActorFromActorInfo()->GetInstigatorController());
}

void AAroundTargetActor::ConfirmTargetingAndContinue()
{
	FVector LookPoint = PrimaryPC->GetPawn()->K2_GetActorLocation();

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
			FCollisionShape::MakeSphere(AroundRadius),
			CollisionParams
		);

		// 创建一个数据句柄，用来封装目标信息
		FGameplayAbilityTargetDataHandle TargetDataHandle;

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

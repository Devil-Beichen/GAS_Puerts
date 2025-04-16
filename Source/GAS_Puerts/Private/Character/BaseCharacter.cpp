// Fill out your copyright notice in the Description page of Project Settings.


#include "Character/BaseCharacter.h"

#include "AbilitySystemComponent.h"
#include "Abilitys/BaseAttributeSet.h"

ABaseCharacter::ABaseCharacter()
{
	PrimaryActorTick.bCanEverTick = true;

	AbilitySystemComponent = CreateDefaultSubobject<UAbilitySystemComponent>(TEXT("AbilitySystemComponent"));
}

void ABaseCharacter::BeginPlay()
{
	Super::BeginPlay();
}

void ABaseCharacter::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void ABaseCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
	if (AbilitySystemComponent)
	{
		// 监听属性变化
		AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(UBaseAttributeSet::GetHPAttribute()).AddUObject(this,&ABaseCharacter::OnHPAttributeChanged);
		AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(UBaseAttributeSet::GetMPAttribute()).AddUObject(this,&ABaseCharacter::OnMPAttributeChanged);
		AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(UBaseAttributeSet::GetSPAttribute()).AddUObject(this,&ABaseCharacter::OnSPAttributeChanged);
	}
}

void ABaseCharacter::OnHPAttributeChanged(const FOnAttributeChangeData& Data)
{
	// 属性值发生变化
	if (Data.OldValue != Data.NewValue)
	{
		HPChanged.Broadcast(Data.NewValue);
	}
}

void ABaseCharacter::OnMPAttributeChanged(const FOnAttributeChangeData& Data)
{
	// 属性值发生变化
	if (Data.OldValue != Data.NewValue)
	{
		MPChanged.Broadcast(Data.NewValue);
	}
}

void ABaseCharacter::OnSPAttributeChanged(const FOnAttributeChangeData& Data)
{
	// 属性值发生变化
	if (Data.OldValue != Data.NewValue)
	{
		SPChanged.Broadcast(Data.NewValue);
	}
}

// Fill out your copyright notice in the Description page of Project Settings.


#include "AnimNotify/YcAnimNotify_Script.h"

FString UYcAnimNotify_Script::GetNotifyName_Implementation() const
{
	return FunctionName.ToString();
}

void UYcAnimNotify_Script::Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, const FAnimNotifyEventReference& EventReference)
{
	Super::Notify(MeshComp, Animation, EventReference);

	if (!MeshComp) return;

	if (AActor* TempActor = MeshComp->GetOwner())
	{
		if (UFunction* TempFunction = TempActor->FindFunction(FunctionName))
		{
			TempActor->ProcessEvent(TempFunction, nullptr);
		}
	}
}

// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Animation/AnimNotifies/AnimNotify.h"
#include "YcAnimNotify_Script.generated.h"

/**
 * 动画脚本通知(用于动画直接调用函数，无参的)
 */
UCLASS()
class GAS_PUERTS_API UYcAnimNotify_Script : public UAnimNotify
{
	GENERATED_BODY()

public:
	// 函数名
	UPROPERTY(EditAnywhere, Category="Name")
	FName FunctionName = "None";

	// 获取通知名称
	virtual FString GetNotifyName_Implementation() const override;

	// 触发通知
	virtual void Notify(USkeletalMeshComponent* MeshComp, UAnimSequenceBase* Animation, const FAnimNotifyEventReference& EventReference) override;
};

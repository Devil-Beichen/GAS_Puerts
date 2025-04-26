// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "ExtensionMethods.h"
#include "YC_ExtensionMethods.generated.h"

class UInputAction;
/**
 * 导出扩展方法
 */
UCLASS()
class GAS_PUERTS_API UYC_ExtensionMethods : public UExtensionMethods
{
	GENERATED_BODY()

public:
	/**
	 * 绑定输入动作
	 * @param InputComponent 输入组件
	 * @param InputAction 输入动作
	 * @param TriggerEvent 触发事件
	 * @param Object 绑定的对象
	 * @param FunctionName 绑定的函数名
	 */
	UFUNCTION(BlueprintCallable, Category="YCExtensionMethods")
	static void BindAction(UEnhancedInputComponent* InputComponent, const UInputAction* InputAction, const ETriggerEvent TriggerEvent, UObject* Object, const FName& FunctionName);
};

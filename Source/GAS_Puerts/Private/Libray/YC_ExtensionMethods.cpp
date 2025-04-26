// Fill out your copyright notice in the Description page of Project Settings.


#include "Libray/YC_ExtensionMethods.h"

#include "EnhancedInputComponent.h"

void UYC_ExtensionMethods::BindAction(UEnhancedInputComponent* InputComponent, const UInputAction* InputAction, const ETriggerEvent TriggerEvent, UObject* Object, const FName& FunctionName)
{
	if (InputComponent)
	{
		InputComponent->BindAction(InputAction, TriggerEvent, Object, FunctionName);
	}
}

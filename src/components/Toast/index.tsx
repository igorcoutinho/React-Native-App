import {
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
} from '@gluestack-ui/themed';
import React from 'react';

export const ToastComponent = ({
  action,
  message,
  title,
  toastId,
}: {
  action: 'error' | 'warning' | 'success' | 'info' | 'attention' | undefined;
  message: string;
  title?: string;
  toastId: string;
}) => {
  return (
    <Toast nativeID={'toast-' + toastId} action={action} variant="solid">
      <VStack space="xs">
        {title ? <ToastTitle>{title}</ToastTitle> : null}
        <ToastDescription>{message}</ToastDescription>
      </VStack>
    </Toast>
  );
};

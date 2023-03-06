import type { ExtraDataType, ToastContextType } from 'react-native-chat-uikit';

export function handleToastEvent(params: {
  toast: ToastContextType;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}

import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

export function handleAlertEvent(params: {
  alert: Pick<DialogContextType, 'openAlert'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}

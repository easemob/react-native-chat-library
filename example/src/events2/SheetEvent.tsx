import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

export function handleSheetEvent(params: {
  sheet: Pick<DialogContextType, 'openSheet'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}

import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

export function handleMenuEvent(params: {
  menu: Pick<DialogContextType, 'openMenu'>;
  event: any;
  extra: ExtraDataType;
}): void {
  console.log('test:', params.event);
}

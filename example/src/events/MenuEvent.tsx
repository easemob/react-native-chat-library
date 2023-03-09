import type { DialogContextType, ExtraDataType } from 'react-native-chat-uikit';

import type { MenuActionEventType } from './Events';
import type { BizEventType } from './types';

export function handleMenuEvent(params: {
  menu: Pick<DialogContextType, 'openMenu'>;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const menuEvent = params.event as {
    eventBizType: BizEventType;
    action: MenuActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleMenuEvent:',
    menuEvent.eventBizType,
    menuEvent.action,
    menuEvent.senderId,
    menuEvent.timestamp,
    menuEvent.key
  );
  let ret = true;
  switch (menuEvent.action) {
    case 'long_press_message_bubble':
      params.menu.openMenu({
        menuItems: [
          {
            title: 'delete message',
            onPress: () => {},
          },
          {
            title: 'resend message',
            onPress: () => {},
          },
          {
            title: 'recall message',
            onPress: () => {},
          },
        ],
      });
      break;

    default:
      break;
  }
  return ret;
}

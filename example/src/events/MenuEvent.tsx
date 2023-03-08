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
      {
        const p = menuEvent.params as {};
        params.menu.openMenu({
          menuItems: [
            {
              title: 'delete message',
              onPress: () => {
                console.log('test:111:', p);
              },
            },
            {
              title: 'resend message',
              onPress: () => {
                console.log('test:222:');
              },
            },
            {
              title: 'recall message',
              onPress: () => {
                console.log('test:333:');
              },
            },
          ],
        });
      }
      break;

    default:
      break;
  }
  return ret;
}

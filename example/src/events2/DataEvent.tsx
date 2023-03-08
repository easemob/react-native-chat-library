import type { DataActionEventType } from './Events';
import type { BizEventType } from './types';

// const sendEventFromData = (
//   params: Omit<sendEventProps, 'senderId' | 'timestamp'>
// ) => {
//   sendEvent({
//     ...params,
//     senderId: 'DataEvent',
//   } as sendEventProps);
// };

export function handleDataEvent(params: { event: any; extra: any }): boolean {
  const dataEvent = params.event as {
    eventBizType: BizEventType;
    action: DataActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleDataEvent:',
    dataEvent.eventBizType,
    dataEvent.action,
    dataEvent.senderId,
    dataEvent.timestamp,
    dataEvent.key
  );
  let ret = true;
  switch (dataEvent.action) {
    case 'data_':
      break;
    default:
      ret = false;
      break;
  }
  return ret;
}

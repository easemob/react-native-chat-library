import { DeviceEventEmitter } from 'react-native';
import { timestamp } from 'react-native-chat-uikit';

import type { ActionEventType } from './Events';
import type { BizEventType, EventType } from './types';

const SEND_EVENT = '_demo';

export type sendEventProps = {
  eventType: EventType;
  eventBizType: BizEventType;
  action: ActionEventType;
  senderId: string;
  params: any;
  timestamp?: number;
};

export function sendEvent(params: sendEventProps): void {
  console.log('test:sendEvent:', params);
  DeviceEventEmitter.emit(params.eventType, {
    eventBizType: params.eventBizType,
    senderId: params.senderId,
    action: params.action,
    params: params.params,
    timestamp: params.timestamp ?? timestamp(),
    key: SEND_EVENT,
  });
}

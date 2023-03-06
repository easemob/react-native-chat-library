import { DeviceEventEmitter } from 'react-native';

import { timestamp } from '../utils/generator';
import type { UikitBizEventType, UikitEventType } from './types';

const SEND_UIKIT_EVENT = '_uikit';

export type sendUikitEventProps = {
  eventType: UikitEventType;
  eventBizType: UikitBizEventType;
  senderId: string;
  action: string;
  params: any;
  timestamp?: number;
};

export function sendUikitEvent(params: sendUikitEventProps): void {
  console.log('test:sendUikitEvent:', params);
  DeviceEventEmitter.emit(params.eventType, {
    eventType: params.eventType,
    eventBizType: params.eventBizType,
    senderId: params.senderId,
    action: params.action,
    params: params.params,
    timestamp: params.timestamp ?? timestamp(),
    key: SEND_UIKIT_EVENT,
  });
}

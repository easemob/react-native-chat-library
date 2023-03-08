import * as React from 'react';
import { Text, View } from 'react-native';
import {
  ExtraDataType,
  getScaleFactor,
  LocalIcon,
  ThemeContextType,
  VoiceStateContextType,
} from 'react-native-chat-uikit';

import type { AppStringSet } from '../I18n/AppCStringSet.en';
import type { StateActionEventType } from './Events';
import type { BizEventType } from './types';

export function handleVoiceStateEvent(params: {
  voiceState: VoiceStateContextType;
  event: any;
  extra: ExtraDataType;
}): boolean {
  const sf = getScaleFactor();
  const stateEvent = params.event as {
    eventBizType: BizEventType;
    action: StateActionEventType;
    senderId: string;
    params: any;
    timestamp: number;
    key: string;
  };
  console.log(
    'test:handleVoiceStateEvent:',
    stateEvent.eventBizType,
    stateEvent.action,
    stateEvent.senderId,
    stateEvent.timestamp,
    stateEvent.key
  );
  let ret = true;
  switch (stateEvent.action) {
    case 'enable_voice':
      {
        const extra = params.extra.getData?.() as {
          theme: ThemeContextType;
          i18n: AppStringSet;
        };
        const { chat } = extra.i18n;
        params.voiceState.showState({
          children: (
            <View
              style={{
                height: sf(100),
                width: sf(161),
                borderRadius: sf(16),
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <LocalIcon name="mic" size={sf(40)} />
                <LocalIcon name="volume8" size={sf(40)} />
              </View>
              <Text style={{ color: 'white' }}>{chat.voiceState}</Text>
            </View>
          ),
        });
      }
      break;
    case 'disable_voice':
      params.voiceState.hideState();
      break;

    default:
      ret = false;
      break;
  }
  return ret;
}

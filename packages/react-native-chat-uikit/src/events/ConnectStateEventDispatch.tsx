import { DeviceEventEmitter } from 'react-native';
import { ChatClient, ChatConnectEventListener } from 'react-native-chat-sdk';

export const ConnectStateChatSdkEvent = 'ConnectStateChatSdkEvent';
export type ConnectStateChatSdkEventType =
  | 'onConnected'
  | 'onDisconnected'
  | 'onTokenWillExpire'
  | 'onTokenDidExpire';

export class ConnectStateEventDispatch {
  name: string;
  listener?: ChatConnectEventListener;
  constructor() {
    console.log('test:', ConnectStateEventDispatch.name);
    this.name = ConnectStateEventDispatch.name;
  }
  init(): void {
    console.log('test:init:', ConnectStateEventDispatch.name);
    this.listener = {
      onConnected: (): void => {
        console.log('test:onConnected:');
        DeviceEventEmitter.emit(ConnectStateChatSdkEvent, {
          type: 'onConnected' as ConnectStateChatSdkEventType,
          params: {},
        });
      },
      onDisconnected: (errorCode?: number): void => {
        console.log('test:onDisconnected:', errorCode);
        DeviceEventEmitter.emit(ConnectStateChatSdkEvent, {
          type: 'onDisconnected' as ConnectStateChatSdkEventType,
          params: { error: errorCode },
        });
      },
      onTokenWillExpire: (): void => {
        console.warn('test:onTokenWillExpire:');
        DeviceEventEmitter.emit(ConnectStateChatSdkEvent, {
          type: 'onTokenWillExpire' as ConnectStateChatSdkEventType,
          params: {},
        });
      },
      onTokenDidExpire: (): void => {
        console.warn('test:onTokenDidExpire:');
        DeviceEventEmitter.emit(ConnectStateChatSdkEvent, {
          type: 'onTokenDidExpire' as ConnectStateChatSdkEventType,
          params: {},
        });
      },
    } as ChatConnectEventListener;
    ChatClient.getInstance().addConnectionListener(this.listener);
  }
  unInit(): void {
    console.log('test:unInit:', ConnectStateEventDispatch.name);
    if (this.listener) {
      ChatClient.getInstance().removeConnectionListener(this.listener);
    }
  }
}

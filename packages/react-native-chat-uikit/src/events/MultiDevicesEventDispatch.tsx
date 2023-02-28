import {
  ChatClient,
  ChatMultiDeviceEvent,
  ChatMultiDeviceEventListener,
} from 'react-native-chat-sdk';

export const MultiDevicesChatSdkEvent = 'MultiDevicesChatSdkEvent';
export type MultiDevicesChatSdkEventType =
  | 'onConnected'
  | 'onDisconnected'
  | 'onTokenWillExpire'
  | 'onTokenDidExpire';

export class MultiDevicesEventDispatch {
  name: string;
  listener?: ChatMultiDeviceEventListener;
  constructor() {
    console.log('test:', MultiDevicesEventDispatch.name);
    this.name = MultiDevicesEventDispatch.name;
  }
  init(): void {
    console.log('test:init:', MultiDevicesEventDispatch.name);
    this.listener = {
      onContactEvent: (
        event?: ChatMultiDeviceEvent,
        target?: string,
        ext?: string
      ): void => {
        console.log('test:onContactEvent:', event, target, ext);
      },
      onGroupEvent: (
        event?: ChatMultiDeviceEvent,
        target?: string,
        usernames?: string[]
      ): void => {
        console.log('test:onGroupEvent:', event, target, usernames);
      },
      onThreadEvent: (
        event?: ChatMultiDeviceEvent,
        target?: string,
        usernames?: string[]
      ): void => {
        console.log('test:onGroupEvent:', event, target, usernames);
      },
    } as ChatMultiDeviceEventListener;
    ChatClient.getInstance().addMultiDeviceListener(this.listener);
  }
  unInit(): void {
    console.log('test:unInit:', MultiDevicesEventDispatch.name);
    if (this.listener) {
      ChatClient.getInstance().removeMultiDeviceListener(this.listener);
    }
  }
}

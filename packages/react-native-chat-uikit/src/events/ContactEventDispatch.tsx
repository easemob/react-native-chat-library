import { DeviceEventEmitter } from 'react-native';
import { ChatClient, ChatContactEventListener } from 'react-native-chat-sdk';

export const ContactChatSdkEvent = 'ContactChatSdkEvent';
export type ContactChatSdkEventType =
  | 'onContactInvited'
  | 'onContactAdded'
  | 'onContactDeleted'
  | 'onFriendRequestAccepted'
  | 'onFriendRequestDeclined';

export class ContactEventDispatch {
  name: string;
  listener?: ChatContactEventListener;
  constructor() {
    console.log('test:', ContactEventDispatch.name);
    this.name = ContactEventDispatch.name;
  }
  init(): void {
    console.log('test:init:', ContactEventDispatch.name);
    this.listener = {
      onContactInvited: async (userName: string, reason?: string) => {
        console.log('test:onContactInvited:', userName, reason);
        DeviceEventEmitter.emit(ContactChatSdkEvent, {
          type: 'onContactInvited' as ContactChatSdkEventType,
          params: { id: userName, error: reason },
        });
      },

      onContactAdded: (userName: string) => {
        console.log('test:onContactAdded:', userName);
        DeviceEventEmitter.emit(ContactChatSdkEvent, {
          type: 'onContactAdded' as ContactChatSdkEventType,
          params: { id: userName },
        });
      },

      onContactDeleted: (userName: string): void => {
        console.log('test:onContactDeleted:', userName);
        DeviceEventEmitter.emit(ContactChatSdkEvent, {
          type: 'onContactDeleted' as ContactChatSdkEventType,
          params: { id: userName },
        });
      },

      onFriendRequestAccepted: (userName: string): void => {
        console.log('test:onFriendRequestAccepted:', userName);
        DeviceEventEmitter.emit(ContactChatSdkEvent, {
          type: 'onFriendRequestAccepted' as ContactChatSdkEventType,
          params: { id: userName },
        });
      },

      onFriendRequestDeclined: (userName: string): void => {
        console.log('test:onFriendRequestDeclined:', userName);
        DeviceEventEmitter.emit(ContactChatSdkEvent, {
          type: 'onFriendRequestDeclined' as ContactChatSdkEventType,
          params: { id: userName },
        });
      },
    } as ChatContactEventListener;
    ChatClient.getInstance().contactManager.addContactListener(this.listener);
  }
  unInit(): void {
    console.log('test:unInit:', ContactEventDispatch.name);
    if (this.listener) {
      ChatClient.getInstance().contactManager.removeContactListener(
        this.listener
      );
    }
  }
}

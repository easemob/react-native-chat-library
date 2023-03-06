import { DeviceEventEmitter } from 'react-native';
import {
  ChatClient,
  ChatGroupMessageAck,
  ChatMessage,
  ChatMessageEventListener,
  ChatMessageReactionEvent,
  ChatMessageThreadEvent,
} from 'react-native-chat-sdk';

export const MessageChatSdkEvent = 'MessageChatSdkEvent';
export type MessageChatSdkEventType =
  | 'onMessagesReceived'
  | 'onCmdMessagesReceived'
  | 'onMessagesRead'
  | 'onGroupMessageRead'
  | 'onMessagesDelivered'
  | 'onMessagesRecalled'
  | 'onConversationsUpdate'
  | 'onConversationRead'
  | 'onMessageReactionDidChange'
  | 'onChatMessageThreadCreated'
  | 'onChatMessageThreadUpdated'
  | 'onChatMessageThreadDestroyed'
  | 'onChatMessageThreadUserRemoved';

export class MessageEventDispatch {
  name: string;
  listener?: ChatMessageEventListener;
  constructor() {
    console.log('test:', MessageEventDispatch.name);
    this.name = MessageEventDispatch.name;
  }
  init(): void {
    console.log('test:init:', MessageEventDispatch.name);
    this.listener = {
      onMessagesReceived: async (messages: ChatMessage[]): Promise<void> => {
        /// todo: !!! 10000 message count ???
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onMessagesReceived' as MessageChatSdkEventType,
          params: { messages: messages },
        });
      },

      onCmdMessagesReceived: (messages: ChatMessage[]): void => {
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onCmdMessagesReceived' as MessageChatSdkEventType,
          params: { messages: messages },
        });
      },

      onMessagesRead: async (messages: ChatMessage[]): Promise<void> => {
        /// todo: !!! 10000 message count ???
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onMessagesRead' as MessageChatSdkEventType,
          params: { messages: messages },
        });
      },

      onGroupMessageRead: (messages: ChatGroupMessageAck[]): void => {
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onGroupMessageRead' as MessageChatSdkEventType,
          params: { messages: messages },
        });
      },

      onMessagesDelivered: (messages: ChatMessage[]): void => {
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onMessagesDelivered' as MessageChatSdkEventType,
          params: { messages: messages },
        });
      },

      onMessagesRecalled: (messages: ChatMessage[]): void => {
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onMessagesRecalled' as MessageChatSdkEventType,
          params: { messages: messages },
        });
      },

      onConversationsUpdate: (): void => {
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onConversationsUpdate' as MessageChatSdkEventType,
          params: {},
        });
      },

      onConversationRead: (): void => {
        DeviceEventEmitter.emit(MessageChatSdkEvent, {
          type: 'onConversationRead' as MessageChatSdkEventType,
          params: {},
        });
      },

      onMessageReactionDidChange: (_: ChatMessageReactionEvent[]): void => {},

      onChatMessageThreadCreated: (_: ChatMessageThreadEvent): void => {},

      onChatMessageThreadUpdated: (_: ChatMessageThreadEvent): void => {},

      onChatMessageThreadDestroyed: (_: ChatMessageThreadEvent): void => {},

      onChatMessageThreadUserRemoved: (_: ChatMessageThreadEvent): void => {},
    } as ChatMessageEventListener;
    ChatClient.getInstance().chatManager.addMessageListener(this.listener);
  }
  unInit(): void {
    console.log('test:unInit:', MessageEventDispatch.name);
    if (this.listener) {
      ChatClient.getInstance().chatManager.removeMessageListener(this.listener);
    }
  }
}

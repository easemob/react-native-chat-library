import {
  ChatClient,
  ChatConversationType,
  ChatCustomMessageBody,
  ChatMessageType,
  ChatSearchDirection,
} from 'react-native-chat-sdk';
import {
  UIKitChatSdkContext,
  useChatSdkContext,
} from 'react-native-chat-uikit';

export class AppChatSdkContext extends UIKitChatSdkContext {
  getAllUnreadCount: (params: {
    currentId: string;
    onResult: (result: { unread: boolean; error?: any }) => void;
  }) => Promise<void>;
  constructor(params: { client: ChatClient }) {
    super(params.client);
    this.getAllUnreadCount = async (params: {
      currentId: string;
      onResult: (result: { unread: boolean; error?: any }) => void;
    }): Promise<void> => {
      try {
        const result = await this.client.chatManager.getMessagesWithMsgType(
          params.currentId,
          ChatConversationType.PeerChat,
          ChatMessageType.CUSTOM,
          ChatSearchDirection.DOWN
        );
        let count = 0;
        if (result) {
          for (const item of result) {
            if (item.body.type === ChatMessageType.CUSTOM) {
              const content = (item.body as ChatCustomMessageBody).params;
              const notificationType = content.type;
              if (
                notificationType !== 'ContactInvitationAccepted' &&
                notificationType !== 'GroupRequestJoinAccepted' &&
                notificationType !== 'GroupInvitationAccepted' &&
                notificationType !== 'ContactInvitationDeclined' &&
                notificationType !== 'GroupRequestJoinDeclined' &&
                notificationType !== 'GroupInvitationDeclined'
              ) {
                ++count;
              }
            }
          }
        }
        params.onResult?.({ unread: count !== 0 });
      } catch (error) {
        params.onResult?.({ unread: true, error: error });
      }
    };
  }
}

export function useAppChatSdkContext(): AppChatSdkContext {
  const sdk = useChatSdkContext() as AppChatSdkContext;
  if (!sdk) throw Error('IMSDKContext is not provided');
  return sdk;
}

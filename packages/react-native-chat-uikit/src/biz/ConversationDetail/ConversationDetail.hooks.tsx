import * as React from 'react';

import { useChatContext } from '../../chat';
import { usePermissions } from '../../hook';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import type {
  ConversationDetailProps,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  SendCardProps,
  SendFileProps,
  SendImageProps,
  SendTextProps,
  SendVideoProps,
  SendVoiceProps,
} from './types';
import { useCreateConversationDirectory } from './useCreateConversationDirectory';

export function useConversationDetail(props: ConversationDetailProps) {
  const { convId, convType, convName, testMode, input, list, onInitialized } =
    props;
  const permissionsRef = React.useRef(false);

  const messageInputRef = React.useRef<MessageInputRef>({} as any);
  const messageListRef = React.useRef<MessageListRef>({} as any);
  const _messageInputRef = input?.ref ?? messageInputRef;
  const _MessageInput = input?.render ?? MessageInput;
  const messageInputProps = input?.props
    ? { ...input.props, convId, convType, testMode }
    : { convId, convType, testMode };
  const _messageListRef = list?.ref ?? messageListRef;
  const _MessageList = list?.render ?? MessageList;
  const messageListProps = list?.props
    ? { ...list.props, convId, convType, testMode }
    : { convId, convType, testMode };

  const [avatarUrl, setAvatarUrl] = React.useState<string>();

  usePermissions({
    onResult: (isSuccess) => {
      permissionsRef.current = isSuccess;
    },
  });
  const { createDirectoryIfNotExisted } = useCreateConversationDirectory();
  const im = useChatContext();
  im.messageManager.setCurrentConvId({ convId, convType, convName });

  const setConversation = React.useCallback(async () => {
    const conv = await im.getConversation({
      convId,
      convType,
      createIfNotExist: true,
      fromNative: true,
    });
    if (conv) {
      if (conv.convName === undefined) {
        conv.convName = convName;
      }
      im.setCurrentConversation({ conv });
      im.setConversationRead({ convId, convType });
      if (conv.convAvatar && conv.convAvatar.length > 0) {
        setAvatarUrl(conv.convAvatar);
      }
    }
  }, [convId, convName, convType, im]);

  React.useEffect(() => {
    const conv = im.getCurrentConversation();
    if (testMode === 'only-ui') {
      if (conv === undefined || conv.convId !== convId) {
        im.setCurrentConversation({ conv: { convId, convType, convName } });
        onInitialized?.(true);
      } else {
        onInitialized?.(false);
      }
    } else {
      setConversation()
        .then(() => {
          onInitialized?.(true);
        })
        .catch(() => {
          onInitialized?.(false);
        });
    }
    return () => {
      const conv = im.getCurrentConversation();
      if (conv) {
        im.setCurrentConversation({ conv: undefined });
      }
    };
  }, [
    convId,
    convName,
    convType,
    im,
    onInitialized,
    setConversation,
    testMode,
  ]);

  React.useEffect(() => {
    createDirectoryIfNotExisted(convId);
  }, [convId, createDirectoryIfNotExisted]);

  const onClickedSend = React.useCallback(
    (
      value:
        | SendTextProps
        | SendFileProps
        | SendImageProps
        | SendVideoProps
        | SendVoiceProps
        | SendCardProps
    ) => {
      _messageListRef.current?.addSendMessage(value);
    },
    [_messageListRef]
  );

  const onQuoteMessageForInput = React.useCallback(
    (model: MessageModel) => {
      _messageInputRef.current?.quoteMessage?.(model);
    },
    [_messageInputRef]
  );

  const onEditMessageForInput = React.useCallback(
    (model: MessageModel) => {
      _messageInputRef.current?.editMessage?.(model);
    },
    [_messageInputRef]
  );

  const onEditMessageFinished = React.useCallback(
    (model: MessageModel) => {
      _messageListRef.current?.editMessageFinished?.(model);
    },
    [_messageListRef]
  );

  return {
    onClickedSend,
    _messageInputRef,
    _MessageInput,
    messageInputProps,
    _messageListRef,
    _MessageList,
    messageListProps,
    onQuoteMessageForInput,
    onEditMessageForInput,
    onEditMessageFinished,
    avatarUrl,
  };
}
